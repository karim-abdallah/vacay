/*
Assumes ordered list of months including all relevant data
*/

import { monthYearFormatter } from '../helpers/vacay_helpers';

export const mockData = {
  labels: [
    'September 2022',
    'October 2022',
    'November 2022',
    'December 2022',
    'January 2023',
    'February 2023',
    'March 2023',
    'April 2023',
    'May 2023',
    'June 2023',
    'July 2023',
    'August 2023',
  ],
  datasets: [
    {
      label: 'Holidays',
      backgroundColor: '#FF0099',
      borderRadius: 10,
      data: [1, 0, 1, 2, 2, 0, 0, 1, 1, 0, 1, 0],
    },
    {
      label: 'Booked',
      backgroundColor: '#6A48FF',
      borderRadius: 10,
      data: [3, 0, 1, 6, 0, 1, 0, 0, 3, 0, 2, 1],
    },
    {
      label: 'Balance',
      backgroundColor: '#AC9BF2',
      borderRadius: 10,
      data: [5, 6.5, 7, 2.5, 5, 5.5, 7, 7.5, 6, 7.5, 7, 7.5],
    },
  ],
};

export const firstDayOfCurrentMonth = () => {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);

  return firstDay;
};

export const mockApiResponse = {
  currentMonth: monthYearFormatter(firstDayOfCurrentMonth()),
  currentBalanceDays: 3,
  bookedPTO: {
    dates: [],
  },
  holidays: [
    // Need to set the time to 12 because otherwise the calendars
    // evaluate this in UTC time, not US timezone...
    {
      name: 'Labor Day',
      date: new Date('2023-09-03T12:00:00'),
      active: false,
    },
    {
      name: 'Juneteenth',
      date: new Date('2023-06-10T12:00:00'),
      active: true,
    },
    {
      name: 'Thanksgiving Day',
      date: new Date('2023-11-25T12:00:00'),
      active: true,
    },
    {
      name: 'Christmas Day',
      date: new Date('2023-12-25T12:00:00'),
      active: true,
    },
    {
      name: "New Year's Day",
      date: new Date('2023-01-01T12:00:00'),
      active: true,
    },
    {
      name: "Veteran's Day",
      date: new Date('2023-11-10T12:00:00'),
      active: true,
    },
    {
      name: 'MLK Day',
      date: new Date('2023-01-25T12:00:00'),
      active: false,
    },
    {
      name: 'Memorial Day',
      date: new Date('2023-05-25T12:00:00'),
      active: true,
    },
    {
      name: 'Independence Day',
      date: new Date('2023-07-04T12:00:00'),
      active: true,
    },
  ],
  // holidays: [
  //   {
  //     country: "France",
  //     name: "New Year's Day",
  //     date: new Date("2023-05-01T12:00:00"),
  //     active: false,
  //   },
  //   {
  //     country: "France",
  //     name: "Easter Sunday",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Easter Monday",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Labor Day",
  //     date: new Date("2023-05-01T12:00:00"),
  //     active: false,
  //   },
  //   {
  //     country: "France",
  //     name: "Victory in Europe Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Ascension Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "White Sunday",
  //     date: new Date("2023-05-01T12:00:00"),
  //     active: false,
  //   },
  //   {
  //     country: "France",
  //     name: "Whit Monday",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "National Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Assumption Day",
  //     date: new Date("2023-05-01T12:00:00"),
  //     active: false,
  //   },
  //   {
  //     country: "France",
  //     name: "All Saints' Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Armistice Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  //   {
  //     country: "France",
  //     name: "Christmas Day",
  //     date: new Date("2023-07-14T12:00:00"),
  //     active: true,
  //   },
  // ],

  PTOSettings: {
    accrualType: 'unlimited',
    annualAllowanceDays: 20,
    accrualCapDays: 10,
    currentBalanceDays: 4,
  },
  VacationSettings: {
    annualAllowanceDays: 9,
    accrualCapDays: 5,
    currentBalanceDays: 2,
  },
};

// These are user-input for selected PTO on the reactive app
export const mockSelectedDates = ['2022-03-31', '2022-04-01'];
