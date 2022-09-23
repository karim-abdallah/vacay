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
};

export const mockApiResponse = {
    currentMonth: "September 2022",
    currentBalanceDays: 5,
    bookedPTO: {
        dates: ["2022-09-04", "2022-09-05", "2022-09-06", "2022-11-22", "2022-12-20", "2022-12-21", "2022-12-22", "2022-12-23", "2022-12-24", "2022-12-25", "2023-02-15", "2023-05-20", "2023-05-21", "2023-05-22", "2023-07-05", "2023-07-05", "2023-08-08"]
    },
    holidays: {
        dates: ["2022-09-03", "2022-10-26", "2022-11-25", "2022-11-26", "2022-12-25", "2022-12-31", "2023-01-01", "2023-01-02", "2023-04-12", "2023-05-19", "2023-07-04"],
    },
    accrualRate: 1.5,
    accrualCap: 10,
};


// These are user-input for selected PTO on the reactive app
export const mockSelectedDates = [
    "2022-03-31", "2022-04-01"
];
