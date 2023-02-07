import { defaultMonths, weekendDayIndex } from "../constants";
import { differenceInCalendarDays } from "date-fns";

export const monthYearFormatter = date => {
  // returns date in format "Month Year"
  // Should be moved to util folder
  return defaultMonths[date.getMonth()] + " " + date.getFullYear();
};

export const monthStartFormatter = date => {
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

export const convertDateRangeToDiscreteDates = dateRange => {
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
  for (let n = 0; n < selectedDates.length; n++) {
    for (let m = 0; m < existingDates.length; m++) {
      if (isSameDay(selectedDates[n], existingDates[m])) {
        dedupedDates.delete(selectedDates[n]);
        break;
      }
    }
  }

  return dedupedDates;
};

export const areAllDaysWeekends = daysArray => {
  // Takes an array of DateTime objects and returns True
  // if all days in array are week-ends
  for (let n = 0; n < daysArray.length; n++) {
    if (!weekendDayIndex.includes(daysArray[n].getDay())) {
      return false;
    }
  }
  return true;
};

export const isSelectionAlreadySelected = (daysArray, alreadySelectedArray) => {
  // Returns true if daysArray and alreadySelectedArray contain the same objects
  // For now assumes both arrays are sorted in increasing date (which it should be)
  return (
    daysArray.length === alreadySelectedArray.length &&
    daysArray.every((val, index) => isSameDay(val, alreadySelectedArray[index]))
  );
};

export const isSelectionAlreadyBooked = (daysArray, bookedPTOArray) => {
  // All dates in a selection need to be already booked for
  // unbooking to be accepted.
  // So essentially, make sure all the dates in the array are
  // in the booked store
  if (
    daysArray.filter(x => bookedPTOArray.find(y => isSameDay(x, y))).length !==
    daysArray.length
  ) {
    return false;
  }
  return true;
};

export const isDayInThePast = date => {
  // Verifies if supplied date is in the past
  // If the date is today, returns false
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() < today.getDate()
  ) {
    return true;
  }
  return false;
};

export function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

export function generateDayOffset(date, offsetValue) {
  // takes in a date and a signed integer offset and returns the date
  // offset by the given integer
  // ex: Monday February 2nd 2023 + 1 = Tuesday February 3rd 2023

  return new Date(date.getTime() + offsetValue * 24 * 60 * 60 * 1000);
}
