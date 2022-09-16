import React from "react"
import { Bar } from "react-chartjs-2"
import { mockData } from "../../mocks/dashboardSummary.mock"

const generateDashboardData = () => {
    return mockData;
}

const BarChart = () => {
    const data = generateDashboardData();
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
