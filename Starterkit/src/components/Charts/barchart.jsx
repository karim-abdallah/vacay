import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { selectDashboardData } from "../../store/dashboard/selector";
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
      balancePerMonth[element] = startingBalance - ptoPerMonth[element];
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

  // should probably pass in "selectedWeekends" so that they get cancelled from the
  // computation at the Dashboard level. But should still be highlighted.
  // not the most efficient calculation but that's still fine.
  // Or instead of doing "Selected week-ends" you loop through the whole list and
  // if they're a week-end, you remove them from PTOPerMonth
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
  const dashboardData = useSelector(selectDashboardData);
  const data = generateDashboardData(
    dashboardData.currentMonth,
    dashboardData.currentBalanceDays,
    dashboardData.bookedPTO,
    dashboardData.holidays,
    dashboardData.accrualRate,
    dashboardData.accrualCap
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
