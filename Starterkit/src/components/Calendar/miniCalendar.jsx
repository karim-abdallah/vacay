import Calendar from "react-calendar";
import { useSelector, useDispatch } from "react-redux";
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

function MiniCalendar(props) {
  // let's try using the redux store directly
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
    // This needs to be smarter:
    // Can't duplicate dates
    // Should insert all dates using range (increment days)
    // Should de-dupe holidays & week-ends
    // Eventually should remove dates selected twice
    // 1. expand range to actual days -> Done
    // 2. Filter out those that are on week-end and holidays
    // 3. Dispatch remaining values to redux store
    // TODO: this implementation is kindof ugly... fix it
    const selectedDates = convertDateRangeToDiscreteDates(valueRange);
    const dedupedSelectedDates = filterOutDuplicates(
      selectedDates,
      bookedDates
    );
    const datesWithoutHolidays = filterOutDuplicates(
      [...dedupedSelectedDates],
      holidays
    );
    const filteredDatesToAdd = filterOutWeekends([...datesWithoutHolidays]);

    dispatch({
      type: "bookedPTO/add",
      payload: [...bookedDates.concat([...filteredDatesToAdd])],
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
