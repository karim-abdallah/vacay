/*
Assumes ordered list of months including all relevant data
*/

export const mockData = {
  labels: [
    "September 2022",
    "October 2022",
    "November 2022",
    "December 2022",
    "January 2023",
    "February 2023",
    "March 2023",
    "April 2023",
    "May 2023",
    "June 2023",
    "July 2023",
    "August 2023",
  ],
  datasets: [
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
      data: [3, 0, 1, 6, 0, 1, 0, 0, 3, 0, 2, 1],
    },
    {
      label: "Balance",
      backgroundColor: "#AC9BF2",
      borderRadius: 10,
      data: [5, 6.5, 7, 2.5, 5, 5.5, 7, 7.5, 6, 7.5, 7, 7.5],
    },
  ],
};

export const mockApiResponse = {
  currentMonth: "September 2022",
  currentBalanceDays: 3,
  bookedPTO: {
    dates: [
      "2022-11-22",
      "2022-12-20",
      "2022-12-21",
      "2022-12-22",
      "2022-12-23",
      "2022-12-24",
      "2022-12-25",
      "2023-02-15",
      "2023-05-20",
      "2023-05-21",
      "2023-05-22",
      "2023-07-05",
      "2023-08-08",
    ].map((x) => new Date(x)),
  },
  holidays: [
    // Need to set the time to 12 because otherwise the calendars
    // evaluate this in UTC time, not US timezone...
    {
      name: "Labor Day",
      date: new Date("2022-09-03T12:00:00"),
      active: true,
    },
    {
      name: "Karim's Bday",
      date: new Date("2022-10-26T12:00:00"),
      active: true,
    },
    {
      name: "Thanksgiving Day",
      date: new Date("2022-11-25T12:00:00"),
      active: true,
    },
    {
      name: "Christmas",
      date: new Date("2022-12-25T12:00:00"),
      active: true,
    },
    {
      name: "New Year's Eve",
      date: new Date("2022-12-31T12:00:00"),
      active: true,
    },
    {
      name: "New Year's Day",
      date: new Date("2023-01-01T12:00:00"),
      active: true,
    },
    {
      name: "Pierre's Birthday",
      date: new Date("2023-02-21T12:00:00"),
      active: true,
    },
    {
      name: "MLK Day",
      date: new Date("2023-01-25T12:00:00"),
      active: true,
    },
    {
      name: "Memorial Day",
      date: new Date("2023-05-25T12:00:00"),
      active: true,
    },
    {
      name: "Independence Day",
      date: new Date("2023-07-04T12:00:00"),
      active: true,
    },
  ],
  PTOSettings: {
    annualAllowanceDays: 9,
    accrualCapDays: 5,
    currentBalanceDays: 2,
  },
  VacationSettings: {
    annualAllowanceDays: 9,
    accrualCapDays: 5,
    currentBalanceDays: 2,
  },
};

// These are user-input for selected PTO on the reactive app
export const mockSelectedDates = ["2022-03-31", "2022-04-01"];
