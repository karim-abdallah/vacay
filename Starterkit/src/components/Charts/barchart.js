import React from "react"
import { Bar } from "react-chartjs-2"
import { mockData, mockApiResponse, mockSelectedDates } from "../../mocks/dashboardSummary.mock"

const generateDashboardData = (
    currentMonth,
    currentBalanceDays,
    bookedPTO,
    holidays,
    accrualRate,
    accrualCap,
    selectedDates
) => {
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
}

const BarChart = () => {
    const data = generateDashboardData(mockApiResponse.currentMonth, mockApiResponse.currentBalanceDays, mockApiResponse.bookedPTO, mockApiResponse.holidays, mockApiResponse.accrualRate, mockApiResponse.accrualCap, mockSelectedDates.dates);
    const options = {
        plugins: {
            legend: {
                position: 'right',
            },
        }
    }

    return <Bar height={100} width={250} data={data} options={options}/>
}

export default BarChart
