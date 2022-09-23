import React from "react";
import { defaultMonths } from "../../constants";
import { Bar } from "react-chartjs-2";
import {
  mockData,
  mockApiResponse,
  mockSelectedDates,
} from "../../mocks/dashboardSummary.mock";

const monthYearFormatter = (date) => {
  // returns date in format "Month Year"
  // Should be moved to util folder
  return defaultMonths[date.getMonth()] + " " + date.getFullYear();
};

const computeNextTwelveMonths = (startingMonth) => {
  // This is causing a weird exception in the console log. If it's too slow
  // get that to compute in the backend and return nextTwelveMonths in mock API
  // Response
  const nextTwelveMonths = [];
  nextTwelveMonths.push(startingMonth);
  for (let step = 0; step < 11; step++) {
    const month = new Date(nextTwelveMonths[nextTwelveMonths.length - 1]);
    month.setDate(month.getDate() + 31);
    const monthString = monthYearFormatter(month);
    nextTwelveMonths.push(monthString);
  }
  return nextTwelveMonths;
};

const generateDashboardData = (
  currentMonth,
  currentBalanceDays,
  bookedPTO,
  holidays,
  accrualRate,
  accrualCap,
  selectedDates
) => {
  const monthLabels = computeNextTwelveMonths(currentMonth);
  // create a map already with pto per month and count == o
  const PTOPerMonth = {};
  const HolidaysPerMonth = {};

  monthLabels.forEach((element, index) => {
    PTOPerMonth[element] = 0;
    HolidaysPerMonth[element] = 0;
  });

  console.log(PTOPerMonth);

  bookedPTO.dates.forEach((element, index) => {
    const currentDate = new Date(element);
    const monthLabel = monthYearFormatter(currentDate);
    PTOPerMonth[monthLabel] = PTOPerMonth[monthLabel] + 1;
  });

  holidays.dates.forEach((element, index) => {
    const currentDate = new Date(element);
    const monthLabel = monthYearFormatter(currentDate);
    HolidaysPerMonth[monthLabel] = HolidaysPerMonth[monthLabel] + 1;
  });

  // for each entry in dates:
  // parse out month from date
  // then increment the PTO per month object with 1 for object month value
  // Compute all labels
  // transform bookedPTO into Month + year map
  console.log(monthLabels);
  console.log(PTOPerMonth);
  console.log(HolidaysPerMonth);
  // Compute booked PTO per month
  // compute holidays per month
  // compute balance = previous balance + accrual rate - booked
  // consider case of accrual Cap

  // generate 12 months starting from today's month
  // setup starting month balance.
  // For each month:
  //   calculate: previous balance + accrual rate - booked
  //   set holidays
  //   set booked
  //   set balanced

  return mockData;
};

const BarChart = () => {
  const data = generateDashboardData(
    mockApiResponse.currentMonth,
    mockApiResponse.currentBalanceDays,
    mockApiResponse.bookedPTO,
    mockApiResponse.holidays,
    mockApiResponse.accrualRate,
    mockApiResponse.accrualCap,
    mockSelectedDates.dates
  );
  const options = {
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return <Bar height={100} width={250} data={data} options={options} />;
};

export default BarChart;
