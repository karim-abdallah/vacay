import React from "react";
import { Bar } from "react-chartjs-2";
import {
  mockApiResponse,
  mockSelectedDates,
} from "../../mocks/dashboardSummary.mock";
import {
  monthYearFormatter,
  computeNextTwelveMonths,
} from "../../helpers/vacay_helpers";

const computeMonthlyBalance = (
  orderedLabels,
  balancePerMonth,
  startingBalance,
  accrualRate,
  accrualCap,
  ptoPerMonth
) => {
  // For each month:
  //   calculate: previous balance + accrual rate - booked
  orderedLabels.forEach((element, index) => {
    if (index === 0) {
      // starting balance
      balancePerMonth[element] = startingBalance;
    } else {
      // compute previous balance + accrual rate - booked
      balancePerMonth[element] =
        balancePerMonth[orderedLabels[index - 1]] +
        accrualRate -
        ptoPerMonth[element];
    }
  });
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

  // create a map already with pto per month and count == 0
  const PTOPerMonth = {};
  const holidaysPerMonth = {};
  const balance = {};

  monthLabels.forEach((element, index) => {
    PTOPerMonth[element] = 0;
    holidaysPerMonth[element] = 0;
    balance[element] = 0;
  });

  bookedPTO.dates.forEach((element, index) => {
    const currentDate = new Date(element);
    const monthLabel = monthYearFormatter(currentDate);
    PTOPerMonth[monthLabel] = PTOPerMonth[monthLabel] + 1;
  });

  holidays.dates.forEach((element, index) => {
    const currentDate = new Date(element);
    const monthLabel = monthYearFormatter(currentDate);
    holidaysPerMonth[monthLabel] = holidaysPerMonth[monthLabel] + 1;
  });

  computeMonthlyBalance(
    monthLabels,
    balance,
    currentBalanceDays,
    accrualRate,
    accrualCap,
    PTOPerMonth,
    holidaysPerMonth
  );

  // put together the data object
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Holidays",
        backgroundColor: "#FF0099",
        borderRadius: 10,
        data: monthLabels.map((x) => holidaysPerMonth[x]),
      },
      {
        label: "Booked",
        backgroundColor: "#6A48FF",
        borderRadius: 10,
        data: monthLabels.map((x) => PTOPerMonth[x]),
      },
      {
        label: "Balance",
        backgroundColor: "#AC9BF2",
        borderRadius: 10,
        data: monthLabels.map((x) => balance[x]),
      },
    ],
  };

  return chartData;
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
