import React from "react";
import { Bar } from "react-chartjs-2";
import { useSelector, useDispatch } from "react-redux";
import {
  selectDashboardData,
  getSelectedDates,
  getDatesToUnbook,
  getNegativeBalanceMonths,
} from "../../store/dashboard/selector";
import {
  bookedPtoColor,
  holidayColor,
  selectionColor,
  unbookColor,
  balanceColor,
  negativeBalanceColor,
  axisColor,
} from "../../styles/constants";
import {
  monthYearFormatter,
  computeNextTwelveMonths,
  arraysEqual,
} from "../../helpers/vacay_helpers";
import {
  weekendDayIndex,
  barChartBarPercentage,
  barChartBorderRadius,
  PolicyTypes,
  unlimitedMinAxisDays,
} from "../../constants";

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

    // Implement accrual cap
    balancePerMonth[element] =
      balancePerMonth[element] > accrualCap
        ? accrualCap
        : balancePerMonth[element];
  });
};

const generateDashboardDataUnlimitedPTO = (
  currentMonth,
  bookedPTO,
  selectedDates,
  datesToUnbook
) => {
  // for unlimited pto, it should only generate selected days, unbook, days booked, public holidays
  const monthLabels = computeNextTwelveMonths(currentMonth);
  const PTOPerMonth = {};
  const selectedDatesPerMonth = {};
  const datesToUnbookPerMonth = {};

  monthLabels.forEach((element, index) => {
    PTOPerMonth[element] = 0;
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

  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Selected Days",
        backgroundColor: selectionColor,
        data: monthLabels.map((x) => selectedDatesPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Unbook",
        backgroundColor: unbookColor,
        data: monthLabels.map((x) => datesToUnbookPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Days Booked",
        backgroundColor: bookedPtoColor,
        data: monthLabels.map((x) => PTOPerMonth[x]),
        stack: "PTOStack",
      },
    ],
  };

  return chartData;
};

const generateDashboardDataAccrual = (
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

  const negativeBalanceMonths = monthLabels.filter((x) => balance[x] < 0);

  // put together the data object
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Your Balance",
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];

          return value < 0 ? negativeBalanceColor : balanceColor;
        },
        data: monthLabels.map((x) => balance[x].toFixed(1)),
        stack: "PTOStack",
      },
      {
        label: "Selected Days",
        backgroundColor: selectionColor,
        data: monthLabels.map((x) => selectedDatesPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Unbook",
        backgroundColor: unbookColor,
        data: monthLabels.map((x) => datesToUnbookPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Days Booked",
        backgroundColor: bookedPtoColor,
        data: monthLabels.map((x) => PTOPerMonth[x]),
        stack: "PTOStack",
      },
      {
        label: "Public Holidays",
        backgroundColor: holidayColor,
        data: monthLabels.map((x) => holidaysPerMonth[x]),
        borderSkipped: false,
        hidden: true,
      },
    ],
  };

  return [chartData, negativeBalanceMonths];
};

const BarChart = () => {
  const dispatch = useDispatch();
  const dashboardData = useSelector(selectDashboardData);
  const selectedDates = useSelector(getSelectedDates);
  const datesToUnbook = useSelector(getDatesToUnbook);

  let yAxisConfig = {
    border: {
      display: false,
    },
    grid: {
      display: false,
    },
    ticks: {
      color: axisColor,
    },
  };

  let [data, negativeBalanceMonths] = [{}, []];

  switch (dashboardData.accrualType) {
    case PolicyTypes.accrual:
      [data, negativeBalanceMonths] = generateDashboardDataAccrual(
        dashboardData.currentMonth,
        dashboardData.currentBalanceDays,
        dashboardData.bookedPTO,
        dashboardData.holidays,
        dashboardData.accrualRate,
        dashboardData.accrualCap,
        selectedDates,
        datesToUnbook
      );
      const yAxisMax =
        dashboardData.currentBalanceDays + 12 * dashboardData.accrualRate;
      yAxisConfig = {
        ...yAxisConfig,
        max: yAxisMax,
      };
      break;
    case PolicyTypes.unlimited:
      data = generateDashboardDataUnlimitedPTO(
        dashboardData.currentMonth,
        dashboardData.bookedPTO,
        selectedDates,
        datesToUnbook
      );
      const yAxisDefault = unlimitedMinAxisDays;
      yAxisConfig = {
        ...yAxisConfig,
        suggestedMax: yAxisDefault,
      };
      break;
    default:
      [data, negativeBalanceMonths] = [{}, []];
  }

  const currentNegativeBalanceMonths = useSelector(getNegativeBalanceMonths);
  if (!arraysEqual(currentNegativeBalanceMonths, negativeBalanceMonths)) {
    dispatch({
      type: "negativeBalanceMonths/update",
      payload: [...negativeBalanceMonths],
    });
  }

  const options = {
    borderRadius: barChartBorderRadius,
    borderSkipped: false,
    barPercentage: barChartBarPercentage,
    cornerRadius: 20,

    scales: {
      y: yAxisConfig,
      x: {
        display: false,
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // return null
  return <Bar height={83} width={250} data={data} options={options} />;
};

export default BarChart;
