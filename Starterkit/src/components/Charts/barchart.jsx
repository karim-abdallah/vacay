import React from 'react';
import { Chart as ChartJS } from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectDashboardData,
  getSelectedDates,
  getDatesToUnbook,
  getNegativeBalanceMonths,
} from '../../store/dashboard/selector';
import {
  bookedPtoColor,
  holidayColor,
  selectionColor,
  unbookColor,
  balanceColor,
  negativeBalanceColor,
  axisColor,
} from '../../styles/constants';
import {
  monthYearFormatter,
  computeNextTwelveMonths,
  arraysEqual,
} from '../../helpers/vacay_helpers';
import {
  weekendDayIndex,
  barChartBarPercentage,
  barChartBorderRadius,
  PolicyTypes,
} from '../../constants';

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

  const negativeBalanceMonths = monthLabels.filter(x => balance[x] < 0);

  // put together the data object
  const chartData = {
    labels: monthLabels,
    datasets: [
      {
        label: 'Your Balance',
        backgroundColor: function (context) {
          const index = context.dataIndex;
          const value = context.dataset.data[index];

          return value < 0 ? negativeBalanceColor : balanceColor;
        },
        data: monthLabels.map(x => balance[x].toFixed(1)),
        stack: 'PTOStack',
      },
      {
        label: 'Selected Days',
        backgroundColor: selectionColor,
        data: monthLabels.map(x => selectedDatesPerMonth[x]),
        stack: 'PTOStack',
      },
      {
        label: 'Unbook',
        backgroundColor: unbookColor,
        data: monthLabels.map(x => datesToUnbookPerMonth[x]),
        stack: 'PTOStack',
      },
      {
        label: 'Days Booked',
        backgroundColor: bookedPtoColor,
        data: monthLabels.map(x => PTOPerMonth[x]),
        stack: 'PTOStack',
      },
      {
        label: 'Public Holidays',
        backgroundColor: holidayColor,
        data: monthLabels.map(x => holidaysPerMonth[x]),
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

  let [data, negativeBalanceMonths] = [{}, []];

  /*   const [data, negativeBalanceMonths] = generateDashboardData(
    dashboardData.currentMonth,
    dashboardData.currentBalanceDays,
    dashboardData.bookedPTO,
    dashboardData.holidays,
    dashboardData.accrualRate,
    dashboardData.accrualCap,
    selectedDates,
    datesToUnbook
  );
 */

  switch (dashboardData.policyType) {
    case PolicyTypes.accural:
      [data, negativeBalanceMonths] = generateDashboardData(
        dashboardData.currentMonth,
        dashboardData.currentBalanceDays,
        dashboardData.bookedPTO,
        dashboardData.holidays,
        dashboardData.accrualRate,
        dashboardData.accrualCap,
        selectedDates,
        datesToUnbook
      );
      break;
    default:
      [data, negativeBalanceMonths] = [{}, []];
  }

  /*   console.log(data);
  console.log(negativeBalanceMonths);
 */ const currentNegativeBalanceMonths = useSelector(getNegativeBalanceMonths);
  const yAxisMax =
    dashboardData.currentBalanceDays + 12 * dashboardData.accrualRate;

  if (!arraysEqual(currentNegativeBalanceMonths, negativeBalanceMonths)) {
    dispatch({
      type: 'negativeBalanceMonths/update',
      payload: [...negativeBalanceMonths],
    });
  }
  const options = {
    borderRadius: barChartBorderRadius,
    borderSkipped: 'middle',
    barPercentage: barChartBarPercentage,
    scales: {
      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        max: yAxisMax,
        ticks: {
          color: axisColor,
        },
      },
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

  return <Bar height={83} width={250} data={data} options={options} />;
};

export default BarChart;
