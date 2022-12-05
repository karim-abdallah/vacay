import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  selectDashboardData,
  getSelectedDates,
  getDatesToUnbook,
} from "../../store/dashboard/selector";
import {
  monthYearFormatter,
  computeNextTwelveMonths,
} from "../../helpers/vacay_helpers";
import { weekendDayIndex } from "../../constants";

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
  // For each month:
  //   calculate: previous balance + accrual rate - booked
  orderedLabels.forEach((element, index) => {
    if (index === 0) {
      // starting balance
      balancePerMonth[element] =
        startingBalance -
        (ptoPerMonth[element] +
          selectedPerMonth[element] -
          datesToUnbookPerMonth[element]);
    } else {
      balancePerMonth[element] =
        balancePerMonth[orderedLabels[index - 1]] +
        accrualRate -
        (ptoPerMonth[element] + selectedPerMonth[element]);
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
  selectedDates,
  datesToUnbook
) => {
  const monthLabels = computeNextTwelveMonths(currentMonth);

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

  selectedDates.forEach((element, index) => {
    const monthLabel = monthYearFormatter(element);
    // add to booked pto the selection. This will get cleared if we don't book them,
    // but it needs to appear on the chart
    // if currentDate not a week-end, increment, otherwise skip
    if (!weekendDayIndex.includes(element.getDay())) {
      selectedDatesPerMonth[monthLabel] = selectedDatesPerMonth[monthLabel] + 1;
    }
  });

  datesToUnbook.forEach((element, index) => {
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
        stack: "PTOStack",
      },
      {
        label: "Selection",
        backgroundColor: "#FF00FF",
        data: monthLabels.map((x) => selectedDatesPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Unbook",
        backgroundColor: "#6D7994",
        data: monthLabels.map((x) => datesToUnbookPerMonth[x]),
        stack: "PTOStack",
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
  const selectedDates = useSelector(getSelectedDates);
  const datesToUnbook = useSelector(getDatesToUnbook);
  const data = generateDashboardData(
    dashboardData.currentMonth,
    dashboardData.currentBalanceDays,
    dashboardData.bookedPTO,
    dashboardData.holidays,
    dashboardData.accrualRate,
    dashboardData.accrualCap,
    selectedDates,
    datesToUnbook
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
