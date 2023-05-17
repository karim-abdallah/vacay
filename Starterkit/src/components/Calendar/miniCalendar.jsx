import Calendar from "react-calendar";
import { Card } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Tooltip } from "antd";
import {
  selectBookedPTO,
  selectHolidaysDates,
  getHolidays,
  getSelectedDates,
  getDatesToUnbook,
} from "../../store/dashboard/selector";
import {
  bookedPtoColor,
  toggleButtonBackgroundColor,
  cardHoverColor,
  tooltipBackground,
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
  isDayInThePast,
  generateDayOffset,
} from "../../helpers/vacay_helpers";
import {
  StyledBookButton,
  StyledUnbookButton,
  StyledCancelBookingButton,
  StyledConfirmBookingButton,
  StyledCancelUnbookButton,
} from "./buttons.jsx";
import styled from "styled-components";
import minimize from "../../assets/images/minimize.png";

const StyledBookingConfirmationBox = styled(Card)`
  background-color: rgba(106, 72, 255, 0.05);
  margin: 20% 7%;
  padding: 7%;
`;

const StyledUnbookConfirmationBox = styled(Card)`
  background-color: rgba(109, 121, 148, 0.04);
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
  const holidaysWithNames = useSelector(getHolidays);
  const holidayDates = useSelector(selectHolidaysDates);
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
      <StyledUnbookButton onClick={handleShowConfirmation}>
        Unbook
      </StyledUnbookButton>
    );

    if (showBookButton) {
      return bookButton;
    } else if (showUnbookButton) {
      return unbookButton;
    }

    return <div> </div>;
  };

  const ConfirmationBox = () => {
    const selectedDatesWithoutWeekends = selectedDatesLocal.filter(
      (x) => !weekendDayIndex.includes(x.getDay())
    );

    const unselectedDatesWithoutWeekends = datesToUnbook.filter(
      (x) => !weekendDayIndex.includes(x.getDay())
    );

    if (showBookButton) {
      return (
        <StyledBookingConfirmationBox>
          <p>
            Selected dates:{" "}
            <strong>
              {selectedDates[0]?.toLocaleDateString()} -{" "}
              {selectedDates[
                selectedDatesLocal.length - 1
              ]?.toLocaleDateString()}
            </strong>
          </p>
          <p>
            Total duration: <b>{selectedDatesLocal.length}</b>
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
        </StyledBookingConfirmationBox>
      );
    } else if (showUnbookButton) {
      return (
        <StyledUnbookConfirmationBox>
          <p>
            Selected dates:{" "}
            <strong>
              {datesToUnbook[0]?.toLocaleDateString()} -{" "}
              {datesToUnbook[datesToUnbook.length - 1]?.toLocaleDateString()}
            </strong>
          </p>
          <p>
            Total duration: <b>{datesToUnbook.length}</b>
          </p>
          <p>
            Days Unbooked: <b>{unselectedDatesWithoutWeekends.length}</b>
          </p>
          <CenteredFlexContainer>
            <StyledUnbookButton onClick={handleUnbook}>
              Confirm
            </StyledUnbookButton>
            <StyledCancelUnbookButton onClick={handleShowConfirmation}>
              Cancel
            </StyledCancelUnbookButton>
          </CenteredFlexContainer>
        </StyledUnbookConfirmationBox>
      );
    } else {
      return <></>;
    }
  };

  const cancelSelection = () => {
    // remove global selected dates
    selectedDatesLocal.forEach((date) => {
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

  const datesBullets = (currentMonth) => {
    // 1. Create PTO array { date(day) , type }
    // 2. create vacation array
    // 3. combine both arrays
    // 4. sort using date value
    // 5. map: if {type -> return typeBullet(date)} else the other
    const ptoArray = bookedDates
      .filter(
        (x) =>
          x.getMonth() === currentMonth && !weekendDayIndex.includes(x.getDay())
      )
      .map((x) => {
        return { date: x.getDate(), kind: "PTO" };
      });

    const holidaysArray = holidaysWithNames
      .filter((x) => x.active)
      .filter((x) => x.date.getMonth() === currentMonth)
      .map((x) => {
        return { date: x.date.getDate(), name: x.name, kind: "Holiday" };
      });

    // 3. combine both arrays
    const combinedArray = ptoArray.concat(holidaysArray);

    // 4. sort using date value
    const sortedArray = combinedArray.sort((a, b) => a.date - b.date);

    if (sortedArray.length <= 5) {
      return sortedArray.map((x, index) => {
        if (x.kind === "PTO") {
          return <BookedPTOBullet>{x.date}</BookedPTOBullet>;
        } else if (x.kind === "Holiday") {
          return (
            <Tooltip title={x.name} color={tooltipBackground}>
              <HolidayBullet>{x.date}</HolidayBullet>
            </Tooltip>
          );
        } else {
          return null;
        }
      });
    } else {
      const slicedArray = sortedArray.slice(0, 5);

      return slicedArray.map((x, index) => {
        if (index === 4) {
          return (
            <BookedPTOBullet>
              <Dots>...</Dots>
            </BookedPTOBullet>
          );
        } else if (x.kind === "PTO") {
          return <BookedPTOBullet>{x.date}</BookedPTOBullet>;
        } else if (x.kind === "Holiday") {
          return (
            <Tooltip title={x.name} color={tooltipBackground}>
              <HolidayBullet>{x.date}</HolidayBullet>
            </Tooltip>
          );
        } else {
          return null;
        }
      });
    }
  };

  const tileFormatting = ({ date, view }) => {
    // Format specific tiles based on certain rules
    if (selectedDates.find((dDate) => isSameDay(dDate, date))) {
      return "selectedDates";
    } else if (datesToUnbook.find((dDate) => isSameDay(dDate, date))) {
      return "datesToUnbook";
    } else if (holidayDates.find((dDate) => isSameDay(dDate, date))) {
      return "holidays";
    } else if (bookedDates.find((dDate) => isSameDay(dDate, date))) {
      return "bookedDays";
    } else if (isDayInThePast(date)) {
      return "pastDates";
    }
    return "inactiveDays";
  };

  const handleDateSelection = (valueRange) => {
    // 1. Filter out values
    const dateValues = convertDateRangeToDiscreteDates(valueRange);
    const datesWithoutHolidays = [
      ...filterOutDuplicates([...dateValues], holidayDates),
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
    if (isSelectionAlreadySelected(datesWithoutHolidays, selectedDatesLocal)) {
      setSelectedDatesLocal([]);
      hideButtons();
    } else {
      setSelectedDatesLocal([...datesWithoutHolidays]);

      // 2.c if unselected and booked -> unbook and unselect
      if (isSelectionAlreadyBooked(datesWithoutHolidays, bookedDates)) {
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
    cancelSelection();
  };

  const handleShowConfirmation = () => {
    setShowConfirmationBox(!showConfirmationBox);
  };

  const handleBookNow = () => {
    hideButtons();
    dispatch({ type: "bookedPTO/add", payload: [...selectedDatesLocal] });
    selectedDatesLocal.forEach((date) =>
      dispatch({ type: "selectedDates/delete", payload: date })
    );
    setSelectedDatesLocal([]);
    handleShowConfirmation();
  };

  const handleUnbook = () => {
    hideButtons();
    selectedDatesLocal.forEach((date) => {
      dispatch({ type: "datesToUnbook/delete", payload: date });
      dispatch({ type: "bookedPTO/delete", payload: date });
      // unbook week-ends if either monday or friday selected to unbook
      if (date.getDay() === 5) {
        dispatch({
          type: "bookedPTO/delete",
          payload: generateDayOffset(date, 1),
        });
        dispatch({
          type: "bookedPTO/delete",
          payload: generateDayOffset(date, 2),
        });
      }
      if (date.getDay() === 1) {
        dispatch({
          type: "bookedPTO/delete",
          payload: generateDayOffset(date, -1),
        });
        dispatch({
          type: "bookedPTO/delete",
          payload: generateDayOffset(date, -2),
        });
      }
    });
    setSelectedDatesLocal([]);
    handleShowConfirmation();
  };

  return (
    <CalendarContainer
      onClick={!showCalendar ? handleShowCalendar : null}
      showpointer={showCalendar ? "true" : "false"}
    >
      {showConfirmationBox ? (
        <ConfirmationBox />
      ) : (
        <>
          <div>
            <CalendarHeaderContainer>
              <StyledMonthTitle showCalendar={showCalendar}>
                {monthYearFormatter(props.startDate)}{" "}
              </StyledMonthTitle>
              {showCalendar ? (
                <ToggleCalendarButton onClick={handleShowCalendar}>
                  <StyledButtonIcon src={minimize} alt="x" />
                </ToggleCalendarButton>
              ) : null}
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
                formatShortWeekday={(locale, value) =>
                  ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"][
                    value.getDay()
                  ]
                }
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
const Dots = styled.div`
  color: white;
  position: relative;
  bottom: 5px;
`;
const DateBullet = styled.p`
  text-align: center;
  font-size: 16px;
  width: 30px;
  height: 30px;
  font-weight: bold;
  padding-top: 4px;
  margin-right: 5px;
  margin-left: 5px;
  margin-top: 13px;
  color: white;
  border-radius: 50%;
`;

const HolidayBullet = styled(DateBullet)`
  background-color: white;
  color: ${bookedPtoColor};
  border: 3px solid;
  padding-top: 1px;
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
  margin-right: 15px;
  border-width: 0px;
  padding-right: 6px;
  padding-left: 6px;
  padding-bottom: 2px;
  background-color: ${toggleButtonBackgroundColor};
`;

const CalendarHeaderContainer = styled.div`
  margin-top: 15px;
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
  position: relative;
  left: ${(props) => (props.showCalendar ? "20px" : "0px")};
`;

const CalendarContainer = styled(Card)`
  abbr[title] {
    border-bottom: none !important;
    cursor: inherit !important;
    text-decoration: none !important;
  }

  display: flex;
  flex-direction: column;
  min-height: 120px;
  cursor: ${(props) => (props.showpointer === "true" ? "auto" : "pointer")};
  &:hover {
    background-color: ${(props) =>
      props.showpointer !== "true" && cardHoverColor};
  }
`;

export default MiniCalendar;
