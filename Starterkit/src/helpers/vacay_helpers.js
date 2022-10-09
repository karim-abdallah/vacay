import { defaultMonths } from "../constants";

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
