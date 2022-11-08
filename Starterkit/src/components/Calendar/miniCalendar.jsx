import Calendar from "react-calendar";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useSelector } from "react-redux";
import {
  selectBookedPTO,
  selectHolidays,
} from "../../store/dashboard/selector";

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

function MiniCalendar(props) {
  const initialBookedPTO = useSelector(selectBookedPTO);
  const initialHolidays = useSelector(selectHolidays);
  const [bookedDates, setDates] = useState(initialBookedPTO);
  const [holidays] = useState(initialHolidays);
  // pull the redux value for booked days for the given month
  // should be an array of days. When the array gets updated, pull it again and recompute the component.
  // When setting values, should update the redux store
  // pull the redux value for holiday
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
    bookedDates.push(valueRange[0]);
    setDates([...bookedDates]);
  };

  return (
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
    />
  );
}

export default MiniCalendar;
