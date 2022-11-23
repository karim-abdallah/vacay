import Calendar from "react-calendar";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  selectBookedPTO,
  selectHolidays,
  getSelectedDates,
  getDatesToUnbook,
} from "../../store/dashboard/selector";
import {
  isSameDay,
  convertDateRangeToDiscreteDates,
  filterOutDuplicates,
  areAllDaysWeekends,
  isSelectionAlreadyBooked,
} from "../../helpers/vacay_helpers";
import styled from "styled-components";

function MiniCalendar(props) {
  // Local variables
  const [selectedDatesLocal, setSelectedDatesLocal] = useState([]);
  const [showBookButton, setShowBookButton] = useState(false);
  const [mouseSelection, setMouseSelection] = useState();

  // Redux store
  const bookedDates = useSelector(selectBookedPTO);
  const holidays = useSelector(selectHolidays);
  const selectedDates = useSelector(getSelectedDates);
  const datesToUnbook = useSelector(getDatesToUnbook);

  const dispatch = useDispatch();

  const tileFormatting = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
    }
    if (selectedDates.find((dDate) => isSameDay(dDate, date))) {
      return "selectedDates";
    } else if (datesToUnbook.find((dDate) => isSameDay(dDate, date))) {
      return "datesToUnbook";
    } else if (bookedDates.find((dDate) => isSameDay(dDate, date))) {
      return "bookedDays";
    } else if (holidays.find((dDate) => isSameDay(dDate, date))) {
      return "holidays";
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
    setSelectedDatesLocal([...datesWithoutHolidays]);

    // 2. decision tree
    // 2.a. if selected but not booked -> unselect
    // 2. b if selected and booked -> unselect
    // 2.b if unselected and booked -> unbook and unselect
    if (isSelectionAlreadyBooked(dateValues, bookedDates)) {
      // populate datesToCancel
      datesWithoutHolidays.map((date) =>
        dispatch({ type: "datesToUnbook/add", payload: date })
      );
    }
    // 2.c if unselected and unbooked -> book and unselect
    else {
      datesWithoutAlreadyBooked.map((date) =>
        dispatch({ type: "selectedDates/add", payload: date })
      );
      setShowBookButton(true);
    }

    // don't show book button if an idiot tried to book week-ends
    if (areAllDaysWeekends([...datesWithoutAlreadyBooked])) {
      setShowBookButton(false);
    }
    setMouseSelection([]);
  };

  const handleBookNow = () => {
    setShowBookButton(false);
    dispatch({ type: "bookedPTO/add", payload: [...selectedDatesLocal] });
    selectedDatesLocal.map((date) =>
      dispatch({ type: "selectedDates/delete", payload: date })
    );
    setSelectedDatesLocal([]);
  };

  return (
    <CalendarContainer>
      <Calendar
        activeStartDate={props.startDate}
        onChange={handleDateSelection}
        defaultView="month"
        showNeighboringMonth={null}
        tileClassName={tileFormatting}
        selectRange={true}
        prevLabel={null}
        prev2Label={null}
        next2Label={null}
        nextLabel={null}
        value={mouseSelection}
      />
      {showBookButton ? (
        <button onClick={handleBookNow}>Book Now</button>
      ) : null}
    </CalendarContainer>
  );
}

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export default MiniCalendar;
