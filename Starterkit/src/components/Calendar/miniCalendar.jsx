import Calendar from "react-calendar";
import { Card } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  selectBookedPTO,
  selectHolidaysDates,
  getSelectedDates,
  getDatesToUnbook
} from "../../store/dashboard/selector";
import {
  bookedPtoColor,
  holidayColor,
  toggleButtonBackgroundColor
} from "../../styles/constants";
import { weekendDayIndex } from "../../constants";
import {
  monthYearFormatter,
  isSameDay,
  convertDateRangeToDiscreteDates,
  filterOutDuplicates,
  areAllDaysWeekends,
  isSelectionAlreadySelected,
  isSelectionAlreadyBooked,
  isDayInThePast
} from "../../helpers/vacay_helpers";
import {
  StyledBookButton,
  StyledUnbookButton,
  StyledCancelBookingButton,
  StyledConfirmBookingButton
} from "./buttons.jsx";
import styled from "styled-components";
import expand from "../../assets/images/expand.png";
import minimize from "../../assets/images/minimize.png";

const StyledConfirmationBox = styled(Card)`
  background-color: rgba(106, 72, 255, 0.05);
  margin: 20% 7%;
  padding: 7%;
`;

function MiniCalendar(props) {
  // Local variables
  const [selectedDatesLocal, setSelectedDatesLocal] = useState([]);
  const [showBookButton, setShowBookButton] = useState(false);
  const [showUnbookButton, setShowUnbookButton] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(false);
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
    const bookButton = (
      <StyledBookButton onClick={handleShowConfirmation}>Book</StyledBookButton>
    );
    const unbookButton = (
      <StyledUnbookButton onClick={handleUnbook}>Unbook</StyledUnbookButton>
    );

    if (showBookButton) {
      return bookButton;
    } else if (showUnbookButton) {
      return unbookButton;
    }

    return <div> </div>;
  };

  const ConfirmationBox = () => {
    const selectedDatesWithoutWeekends = selectedDates.filter(
      x => !weekendDayIndex.includes(x.getDay())
    );
    console.log(selectedDates[0]);
    console.log(
      `Selected dates length (with weekend): ${selectedDates.length}`
    );
    console.log(
      `Selected dates length (without weekend): ${selectedDatesWithoutWeekends.length})`
    );
    console.log(
      `Selected dates (without weekend): ${selectedDatesWithoutWeekends})`
    );

    return (
      <StyledConfirmationBox>
        <p>
          Selected dates:{" "}
          <strong>
            {selectedDates[0]?.toLocaleDateString()} -{" "}
            {selectedDates[selectedDates.length - 1]?.toLocaleDateString()}
          </strong>
        </p>
        <p>
          Total duration: <b>{selectedDates.length}</b>
        </p>
        <p>
          Days booked: <b>{selectedDatesWithoutWeekends.length}</b>
        </p>
        <CenteredFlexContainer>
          <StyledConfirmBookingButton onClick={handleBookNow}>
            Confirm
          </StyledConfirmBookingButton>
          <StyledCancelBookingButton onClick={handleShowConfirmation}>
            Cancel
          </StyledCancelBookingButton>
        </CenteredFlexContainer>
      </StyledConfirmationBox>
    );
  };

  const cancelSelection = () => {
    // remove global selected dates
    selectedDatesLocal.forEach(date => {
      dispatch({ type: "selectedDates/delete", payload: date });
      dispatch({ type: "datesToUnbook/delete", payload: date });
    });
    // clear local selection
    setSelectedDatesLocal([]);
    setMouseSelection([]);
    // hide buttons
    hideButtons();
    // cancel mouse selection
  };

  const datesBullets = currentMonth => {
    // 1. Create PTO array { date(day) , type }
    // 2. create vacation array
    // 3. combine both arrays
    // 4. sort using date value
    // 5. map: if {type -> return typeBullet(date)} else the other
    const ptoArray = bookedDates
      .filter(
        x =>
          x.getMonth() === currentMonth && !weekendDayIndex.includes(x.getDay())
      )
      .map(x => {
        return { date: x.getDate(), kind: "PTO" };
      });
    const holidaysArray = holidays
      .filter(x => x.getMonth() === currentMonth)
      .map(x => {
        return { date: x.getDate(), kind: "Holiday" };
      });

    // 3. combine both arrays
    const combinedArray = ptoArray.concat(holidaysArray);

    // 4. sort using date value
    const sortedArray = combinedArray.sort((a, b) => a.date - b.date);

    return sortedArray.map(x => {
      if (x.kind === "PTO") {
        return <BookedPTOBullet>{x.date}</BookedPTOBullet>;
      } else if (x.kind === "Holiday") {
        return <HolidayBullet>{x.date}</HolidayBullet>;
      } else {
        return null;
      }
    });
  };

  const tileFormatting = ({ date, view }) => {
    // Format specific tiles based on certain rules
    if (selectedDates.find(dDate => isSameDay(dDate, date))) {
      return "selectedDates";
    } else if (datesToUnbook.find(dDate => isSameDay(dDate, date))) {
      return "datesToUnbook";
    } else if (holidays.find(dDate => isSameDay(dDate, date))) {
      return "holidays";
    } else if (bookedDates.find(dDate => isSameDay(dDate, date))) {
      return "bookedDays";
    } else if (isDayInThePast(date)) {
      return "pastDates";
    }
    return "inactiveDays";
  };

  const handleDateSelection = valueRange => {
    // 1. Filter out values
    const dateValues = convertDateRangeToDiscreteDates(valueRange);
    const datesWithoutHolidays = [
      ...filterOutDuplicates([...dateValues], holidays)
    ];
    const datesWithoutAlreadyBooked = [
      ...filterOutDuplicates([...datesWithoutHolidays], bookedDates)
    ];

    // clear out existing selections
    // for both selected and dates to unbook.
    selectedDatesLocal.forEach(date => {
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
        datesWithoutHolidays.map(date =>
          dispatch({ type: "datesToUnbook/add", payload: date })
        );
        displayUnbookButton();
      }

      // 2.d if unselected and unbooked -> book and unselect
      else {
        datesWithoutAlreadyBooked.map(date =>
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
    cancelSelection();
  };

  const handleShowConfirmation = () => {
    setShowConfirmationBox(!showConfirmationBox);
  };

  const handleBookNow = () => {
    hideButtons();
    dispatch({ type: "bookedPTO/add", payload: [...selectedDatesLocal] });
    selectedDatesLocal.forEach(date =>
      dispatch({ type: "selectedDates/delete", payload: date })
    );
    setSelectedDatesLocal([]);
    handleShowConfirmation();
  };

  const handleUnbook = () => {
    hideButtons();
    selectedDatesLocal.forEach(date => {
      dispatch({ type: "datesToUnbook/delete", payload: date });
      dispatch({ type: "bookedPTO/delete", payload: date });
    });
    setSelectedDatesLocal([]);
  };

  return (
    <CalendarContainer>
      {showConfirmationBox ? (
        <ConfirmationBox />
      ) : (
        <>
          <div>
            <CalendarHeaderContainer>
              <StyledMonthTitle>
                {monthYearFormatter(props.startDate)}{" "}
              </StyledMonthTitle>
              <ToggleCalendarButton onClick={handleShowCalendar}>
                {showCalendar ? (
                  <StyledButtonIcon src={minimize} alt="x" />
                ) : (
                  <StyledButtonIcon src={expand} alt="o" />
                )}
              </ToggleCalendarButton>
            </CalendarHeaderContainer>
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
          ) : (
            <CenteredFlexContainer>
              {datesBullets(props.startDate.getMonth())}
            </CenteredFlexContainer>
          )}
        </>
      )}
    </CalendarContainer>
  );
}

export const StyledButtonIcon = styled.img`
  height: 13px;
`;

const CenteredFlexContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const DateBullet = styled.p`
  text-align: center;
  font-size: 13px;
  width: 25px;
  height: 25px;
  font-weight: bold;
  padding-top: 3px;
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 10px;
  color: white;
  border-radius: 50%;
`;

const HolidayBullet = styled(DateBullet)`
  background-color: ${holidayColor};
`;

const BookedPTOBullet = styled(DateBullet)`
  background-color: ${bookedPtoColor};
`;

const BookButtonContainer = styled.div`
  text-align: center;
`;

const ToggleCalendarButton = styled.button`
  float: right;
  border-radius: 10px;
  text-align: center;
  margin-right: 10px;
  border-width: 0px;
  padding-right: 6px;
  padding-left: 6px;
  padding-bottom: 2px;
  background-color: ${toggleButtonBackgroundColor};
`;

const CalendarHeaderContainer = styled.div`
  margin-top: 10px;
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
  margin-bottom: 10px;
`;

const StyledMonthTitle = styled.b`
  background-color: ${toggleButtonBackgroundColor};
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  border-radius: 15px;
`;

const CalendarContainer = styled(Card)`
  display: flex;
  flex-direction: column;
`;

export default MiniCalendar;
