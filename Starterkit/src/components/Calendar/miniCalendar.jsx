import Calendar from "react-calendar";
import { Card } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  selectBookedPTO,
  selectHolidaysDates,
  getSelectedDates,
  getDatesToUnbook,
} from "../../store/dashboard/selector";
import {
  monthYearFormatter,
  isSameDay,
  convertDateRangeToDiscreteDates,
  filterOutDuplicates,
  areAllDaysWeekends,
  isSelectionAlreadySelected,
  isSelectionAlreadyBooked,
} from "../../helpers/vacay_helpers";
import styled from "styled-components";

function MiniCalendar(props) {
  // Local variables
  const [selectedDatesLocal, setSelectedDatesLocal] = useState([]);
  const [showBookButton, setShowBookButton] = useState(false);
  const [showUnbookButton, setShowUnbookButton] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [mouseSelection, setMouseSelection] = useState();

  // Redux store
  const bookedDates = useSelector(selectBookedPTO);
  const holidays = useSelector(selectHolidaysDates);
  const selectedDates = useSelector(getSelectedDates);
  const datesToUnbook = useSelector(getDatesToUnbook);

  const dispatch = useDispatch();

  const displayBookButton = () => {
    setShowUnbookButton(false);
    setShowBookButton(true);
  };
  const displayUnbookButton = () => {
    setShowBookButton(false);
    setShowUnbookButton(true);
  };

  const hideButtons = () => {
    setShowBookButton(false);
    setShowUnbookButton(false);
  };

  const toggleButtons = () => {
    const bookButton = <button onClick={handleBookNow}>Book Now</button>;
    const unbookButton = <button onClick={handleUnbook}>Unbook</button>;

    if (showBookButton) {
      return bookButton;
    } else if (showUnbookButton) {
      return unbookButton;
    }

    return <div> </div>;
  };

  const tileFormatting = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
    }
    if (selectedDates.find((dDate) => isSameDay(dDate, date))) {
      return "selectedDates";
    } else if (datesToUnbook.find((dDate) => isSameDay(dDate, date))) {
      return "datesToUnbook";
    } else if (holidays.find((dDate) => isSameDay(dDate, date))) {
      return "holidays";
    } else if (bookedDates.find((dDate) => isSameDay(dDate, date))) {
      return "bookedDays";
    }
    return "inactiveDays";
  };

  const handleDateSelection = (valueRange) => {
    // 1. Filter out values
    const dateValues = convertDateRangeToDiscreteDates(valueRange);
    const datesWithoutHolidays = [
      ...filterOutDuplicates([...dateValues], holidays),
    ];
    const datesWithoutAlreadyBooked = [
      ...filterOutDuplicates([...datesWithoutHolidays], bookedDates),
    ];

    // clear out existing selections
    // for both selected and dates to unbook.
    selectedDatesLocal.forEach((date) => {
      dispatch({ type: "selectedDates/delete", payload: date });
      dispatch({ type: "datesToUnbook/delete", payload: date });
    });

    // 2. decision tree
    // 2.a. if already selected -> unselect
    if (isSelectionAlreadySelected(dateValues, selectedDatesLocal)) {
      setSelectedDatesLocal([]);
      hideButtons();
    } else {
      setSelectedDatesLocal([...datesWithoutHolidays]);

      // 2.c if unselected and booked -> unbook and unselect
      if (isSelectionAlreadyBooked(dateValues, bookedDates)) {
        // populate datesToCancel
        datesWithoutHolidays.map((date) =>
          dispatch({ type: "datesToUnbook/add", payload: date })
        );
        displayUnbookButton();
      }

      // 2.d if unselected and unbooked -> book and unselect
      else {
        datesWithoutAlreadyBooked.map((date) =>
          dispatch({ type: "selectedDates/add", payload: date })
        );
        displayBookButton();
      }
    }

    // don't show book button if an idiot tried to select week-ends
    if (areAllDaysWeekends(datesWithoutHolidays)) {
      hideButtons();
    }
    setMouseSelection([]);
  };

  const handleShowCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const handleBookNow = () => {
    hideButtons();
    dispatch({ type: "bookedPTO/add", payload: [...selectedDatesLocal] });
    selectedDatesLocal.forEach((date) =>
      dispatch({ type: "selectedDates/delete", payload: date })
    );
    setSelectedDatesLocal([]);
  };
  const handleUnbook = () => {
    hideButtons();
    selectedDatesLocal.forEach((date) => {
      dispatch({ type: "datesToUnbook/delete", payload: date });
      dispatch({ type: "bookedPTO/delete", payload: date });
    });
    setSelectedDatesLocal([]);
  };

  return (
    <CalendarContainer>
      <div>
        <CalendarMonthTitle>
          {monthYearFormatter(props.startDate)}{" "}
          <ToggleButton onClick={handleShowCalendar}>
            {showCalendar ? "x" : "o"}
          </ToggleButton>
        </CalendarMonthTitle>
      </div>
      {showCalendar ? (
        <>
          <Calendar
            activeStartDate={props.startDate}
            onChange={handleDateSelection}
            defaultView="month"
            showNeighboringMonth={null}
            tileClassName={tileFormatting}
            showNavigation={false}
            selectRange={true}
            value={mouseSelection}
          />
          <BookButtonContainer>{toggleButtons()}</BookButtonContainer>
        </>
      ) : null}
    </CalendarContainer>
  );
}

const BookButtonContainer = styled.div`
  text-align: center;
`;

const ToggleButton = styled.button`
  float: right;
`;

const CalendarMonthTitle = styled.p`
  font-size: 18px;
  text-align: center;
  white-space: nowrap;
`;

const CalendarContainer = styled(Card)`
  display: flex;
  flex-direction: column;
`;

export default MiniCalendar;
