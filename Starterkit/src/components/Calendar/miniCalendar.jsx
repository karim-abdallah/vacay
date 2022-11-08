import Calendar from "react-calendar";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import {
  selectBookedPTO,
  selectHolidays,
} from "../../store/dashboard/selector";
import { convertDateRangeToDiscreteDates } from "../../helpers/vacay_helpers";

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

function MiniCalendar(props) {
  const initialBookedPTO = useSelector(selectBookedPTO);
  const initialHolidays = useSelector(selectHolidays);
  const dispatch = useDispatch();
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
    // This needs to be smarter:
    // Can't duplicate dates
    // Should insert all dates using range (increment days)
    // Should de-dupe holidays & week-ends
    // Eventually should remove dates selected twice
    // 1. expand range to actual days
    // 2. Filter out those that are on week-end and holidays
    // 3. Dispatch remaining values to redux store
    const dates = convertDateRangeToDiscreteDates(valueRange);
    setDates([...bookedDates.concat(dates)]);
    dispatch({
      type: "bookedPTO/add",
      payload: [...bookedDates.concat(dates)],
    });
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
