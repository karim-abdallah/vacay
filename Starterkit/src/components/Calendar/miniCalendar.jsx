import Calendar from "react-calendar";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

function MiniCalendar(props) {
  // TODO: pull initial dates for the given month specifically.
  const initialDates = [new Date("2022-11-12"), new Date("2022-10-13")];
  // these dates states are generated locally. Which is what we wanted. But how to
  // share them accross the application?
  const [bookedDates, setDates] = useState(initialDates);
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
