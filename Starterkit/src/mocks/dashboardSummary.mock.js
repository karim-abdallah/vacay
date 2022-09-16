/*
Assumes ordered list of months including all relevant data
*/

export const mockData = {
    labels: ["September 2022", "October 2022", "November 2022", "December 2022", "January 2023", "February 2023", "March 2023", "April 2023", "May 2023", "June 2023", "July 2023", "August 2023"],
    datasets:[
        {
            label: "Holidays",
            backgroundColor: "#FF0099",
            borderRadius: 10,
            data: [1, 0, 1, 2, 2, 0, 0, 1, 1, 0, 1, 0],
        },
        {
            label: "Booked",
            backgroundColor: "#6A48FF",
            borderRadius: 10,
            data: [3, 0, 1, 5, 0, 1, 0, 0, 3, 0, 2, 1],
        },
        {
            label: "Balance",
            backgroundColor: "#AC9BF2",
            borderRadius: 10,
            data: [5, 6.5, 7, 3.5, 5, 5.5, 7, 7.5, 6, 7.5, 7, 7.5],
        },
    ]
}
