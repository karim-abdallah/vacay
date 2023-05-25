import styled from 'styled-components';
import { axisColor } from '../styles/constants';
import { defaultMonths, weekendDayIndex } from '../constants';
import { differenceInCalendarDays } from 'date-fns';

/* Formatting Helpers */

export const monthYearFormatter = date => {
  // returns date in format "Month Year"
  // Should be moved to util folder
  return defaultMonths[date.getMonth()] + ' ' + date.getFullYear();
};

export const xAxisMonthYearFormatter = date => {
  const formattedDate = (month, year) => {
    return (
      <StyledMonthyearLabel>
        {month}
        <br />
        {year}
      </StyledMonthyearLabel>
    );
  };
  switch (date.getMonth()) {
    case 0:
      return formattedDate('Jan.', date.getFullYear());
    case 1:
      return formattedDate('Feb.', date.getFullYear());
    case 2:
      return formattedDate('Mar.', date.getFullYear());
    case 7:
      return formattedDate('Aug.', date.getFullYear());
    case 8:
      return formattedDate('Sept.', date.getFullYear());
    case 9:
      return formattedDate('Oct.', date.getFullYear());
    case 10:
      return formattedDate('Nov.', date.getFullYear());
    case 11:
      return formattedDate('Dec.', date.getFullYear());
    default:
      return formattedDate(defaultMonths[date.getMonth()], date.getFullYear());
  }
};

const StyledMonthyearLabel = styled.div`
  color: ${axisColor};
`;

export const monthStartFormatter = date => {
  // Returns start date of the month for a given date
  return null;
};

/* Date Manipulation Helpers */

export function getUniqueDates(arraysOfDates) {
  const uniqueDates = new Set();

  const isDateAlreadyInSet = dateToCheck => {
    for (const date of uniqueDates) {
      if (isSameDay(date.getTime(), dateToCheck.getTime())) {
        return true;
      }
    }
    return false;
  };

  for (const dates of arraysOfDates) {
    for (const date of dates) {
      if (!isDateAlreadyInSet(date)) {
        uniqueDates.add(date);
      }
    }
  }

  return Array.from(uniqueDates);
}

export function getDaysInMonth(date) {
  // Get the current month
  const dateCopy = new Date(date); // copy date so that it doesn't mutate the input.
  const month = dateCopy.getMonth();

  // Set the date to the first day of the next month
  dateCopy.setMonth(month + 1, 0);

  // Get the last day of the current month (which is the same as the number of days in the month)
  return dateCopy.getDate();
}

export function generateDayOffset(date, offsetValue) {
  // takes in a date and a signed integer offset and returns the date
  // offset by the given integer
  // ex: Monday February 2nd 2023 + 1 = Tuesday February 3rd 2023

  return new Date(date.getTime() + offsetValue * 24 * 60 * 60 * 1000);
}

export const computeNextNMonths = (
  startingMonth,
  nMonths,
  format = 'string'
) => {
  // Takes in a start month and computes N next ones
  // Returns an array either in Date object format or as string of dates
  const nextNMonths = [];
  let currentDate = new Date(startingMonth);

  for (let step = 0; step < nMonths; step++) {
    const formattedMonth =
      format === 'string'
        ? monthYearFormatter(currentDate)
        : new Date(currentDate);
    nextNMonths.push(formattedMonth);

    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return nextNMonths;
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

/* Array Comparison Helpers */

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
  if (!arr1 || !arr2) {
    return false;
  }
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

/* Logic Helpers */

const computeMonthlyBalance = (
  orderedLabels,
  balancePerMonth,
  startingBalance,
  accrualRate,
  accrualCap,
  ptoPerMonth,
  selectedPerMonth,
  datesToUnbookPerMonth
) => {
  // Calculates monthly balance using orderedLabels as index
  // Writes into balancePerMonth array

  // For each month:
  //   calculate: previous balance + accrual rate - booked
  orderedLabels.forEach((element, index) => {
    if (index === 0) {
      // starting balance
      balancePerMonth[element] =
        startingBalance -
        (ptoPerMonth[element] +
          selectedPerMonth[element] +
          datesToUnbookPerMonth[element]);
    } else {
      balancePerMonth[element] =
        balancePerMonth[orderedLabels[index - 1]] +
        datesToUnbookPerMonth[orderedLabels[index - 1]] +
        accrualRate -
        (ptoPerMonth[element] +
          selectedPerMonth[element] +
          datesToUnbookPerMonth[element]);
    }
  });
};

export const calculateBookedPTOPerMonth = (bookedPTODates, monthLabels) => {
  /* Takes in an array of PTO dates and an array of month lables, and counts the number
  of days per month.

  Returns an object of the format {<month Year>: <count per month>}
  */
  const PTOPerMonth = {};

  monthLabels.forEach(x => (PTOPerMonth[x] = 0));

  bookedPTODates.forEach(x => {
    const monthLabel = monthYearFormatter(x);
    // if currentDate not a week-end, increment, otherwise skip
    if (!weekendDayIndex.includes(x.getDay())) {
      PTOPerMonth[monthLabel] = PTOPerMonth[monthLabel] + 1;
    }
  });

  return PTOPerMonth;
};

/* export const computeMonthlyData = (
  monthLabels,
  currentBalanceDays,
  bookedPTO,
  holidays,
  accrualRate,
  accrualCap,
  selectedDates = null,
  datesToUnbook = null
) => {
  // The below manipulation of sets intends to count the number of days per month
  // for each category. This helps doing the final calculation to populate each month.
  const PTOPerMonth = {};
  const holidaysPerMonth = {};
  const balance = {};
  const selectedDatesPerMonth = {};
  const datesToUnbookPerMonth = {};

  monthLabels.forEach((element, index) => {
    PTOPerMonth[element] = 0;
    holidaysPerMonth[element] = 0;
    balance[element] = 0;
    // These will actually be used on the chart if we can do stacked bars
    selectedDatesPerMonth[element] = 0;
    datesToUnbookPerMonth[element] = 0;
  });

  bookedPTO.dates.forEach((element, index) => {
    const monthLabel = monthYearFormatter(element);
    // if currentDate not a week-end, increment, otherwise skip
    if (!weekendDayIndex.includes(element.getDay())) {
      PTOPerMonth[monthLabel] = PTOPerMonth[monthLabel] + 1;
    }
  });

  holidays.forEach((element, index) => {
    const monthLabel = monthYearFormatter(element);
    holidaysPerMonth[monthLabel] = holidaysPerMonth[monthLabel] + 1;
  });

  selectedDates?.forEach((element, index) => {
    const monthLabel = monthYearFormatter(element);
    // add to booked pto the selection. This will get cleared if we don't book them,
    // but it needs to appear on the chart
    // if currentDate not a week-end, increment, otherwise skip
    if (!weekendDayIndex.includes(element.getDay())) {
      selectedDatesPerMonth[monthLabel] = selectedDatesPerMonth[monthLabel] + 1;
    }
  });

  datesToUnbook?.forEach((element, index) => {
    const monthLabel = monthYearFormatter(element);
    // substract from PTO selection.
    if (!weekendDayIndex.includes(element.getDay())) {
      datesToUnbookPerMonth[monthLabel] = datesToUnbookPerMonth[monthLabel] + 1;
      PTOPerMonth[monthLabel] = PTOPerMonth[monthLabel] - 1;
    }
  });

  computeMonthlyBalance(
    monthLabels,
    balance,
    currentBalanceDays,
    accrualRate,
    accrualCap,
    PTOPerMonth,
    selectedDatesPerMonth,
    datesToUnbookPerMonth
  );
  return [
    PTOPerMonth,
    holidaysPerMonth,
    balance,
    selectedDatesPerMonth,
    datesToUnbookPerMonth,
  ];
};
 */
