import { defaultMonths } from "../constants";
import { differenceInCalendarDays } from "date-fns";

export const monthYearFormatter = (date) => {
  // returns date in format "Month Year"
  // Should be moved to util folder
  return defaultMonths[date.getMonth()] + " " + date.getFullYear();
};

export const monthStartFormatter = (date) => {
  // Returns start date of the month for a given date
  return null;
};

export const computeNextTwelveMonths = (startingMonth, format = "string") => {
  // This is causing a weird exception in the console log. If it's too slow
  // get that to compute in the backend and return nextTwelveMonths in mock API
  // Response
  // Also, this feels a little weird with no typing it's unclear what the return type shoudld be.
  // Maybe split it off into two different functions
  // Also the math is a bit odd here - +31 could lead to errors. Could use a better method
  const nextTwelveMonths = [];
  if (format === "string") {
    nextTwelveMonths.push(startingMonth);
  } else {
    nextTwelveMonths.push(new Date(startingMonth));
  }
  for (let step = 0; step < 11; step++) {
    const month = new Date(nextTwelveMonths[nextTwelveMonths.length - 1]);
    month.setDate(month.getDate() + 31);
    const formattedMonth =
      format === "string" ? monthYearFormatter(month) : month;
    nextTwelveMonths.push(formattedMonth);
  }
  return nextTwelveMonths;
};

export const convertDateRangeToDiscreteDates = (dateRange) => {
  // Returns an array of all dates found in between the two-date dateRange
  // dateRange should be [startDate, endDate]
  const dates = [];
  for (
    let n = 0;
    n < dateRange[1].getDate() - dateRange[0].getDate() + 1;
    n++
  ) {
    dates.push(
      new Date(
        dateRange[0].getFullYear(),
        dateRange[0].getMonth(),
        dateRange[0].getDate() + n
      )
    );
  }
  return dates;
};

export const isSameDay = (a, b) => {
  return differenceInCalendarDays(a, b) === 0;
};

export const filterOutDuplicates = (selectedDates, existingDates) => {
  // If any of the selectedDates is in existingDates -> filter them out.
  // brute force for now, could optimize later down the line
  const dedupedDates = new Set();
  for (let n = 0; n < selectedDates.length; n++) {
    dedupedDates.add(selectedDates[n]);
  }
  console.log(`Deduped dates set: ${[...dedupedDates]}`);
  for (let n = 0; n < selectedDates.length; n++) {
    for (let m = 0; m < existingDates.length; m++) {
      if (isSameDay(selectedDates[n], existingDates[m])) {
        console.log(`Selected date: ${selectedDates[n]}`);
        console.log(`Already booked date: ${existingDates[m]}`);
        dedupedDates.delete(selectedDates[n]);
        break;
      }
    }
  }

  return dedupedDates;
};

export const filterOutWeekends = (selectedDates) => {
  // Not sure how to do that yet... figure it out later
  return selectedDates;
};
