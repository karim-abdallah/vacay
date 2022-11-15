import Calendar from "react-calendar";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import {
  selectBookedPTO,
  selectHolidays,
} from "../../store/dashboard/selector";
import {
  isSameDay,
  convertDateRangeToDiscreteDates,
  filterOutDuplicates,
  filterOutWeekends,
} from "../../helpers/vacay_helpers";
import styled from "styled-components";

function MiniCalendar(props) {
  // let's try using the redux store directly
  const [selectedDatesLocal, setSelectedDatesLocal] = useState();
  const [showBookButton, setShowBookButton] = useState(false);
  const bookedDates = useSelector(selectBookedPTO);
  const holidays = useSelector(selectHolidays);
  const dispatch = useDispatch();
  const tileFormatting = ({ date, view }) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (bookedDates.find((dDate) => isSameDay(dDate, date))) {
        return "bookedDays";
      } else if (holidays.find((dDate) => isSameDay(dDate, date))) {
        return "holidays";
      }
    }
    return "inactiveDays";
  };

  const handleDateSelection = (valueRange) => {
    // 1. Filter out values
    // 2. Store selected dates in local variable
    // 3. Show booked button
    // 4. Dispatch add to SelectedDates redux element

    // TODO: this implementation is kindof ugly... fix it
    const dateValues = convertDateRangeToDiscreteDates(valueRange);
    const dedupedDateValues = filterOutDuplicates(dateValues, bookedDates);
    const datesWithoutHolidays = filterOutDuplicates(
      [...dedupedDateValues],
      holidays
    );
    const filteredDatesToAdd = filterOutWeekends([...datesWithoutHolidays]);

    dispatch({
      type: "bookedPTO/add",
      payload: [...filteredDatesToAdd],
    });
    dispatch({
      type: "selectedDays/add",
      payload: [...filteredDatesToAdd],
    });
    setShowBookButton(true);
  };

  const handleBookNow = () => {
    setShowBookButton(false);
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
        value={selectedDatesLocal}
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
