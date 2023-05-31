import pierreProfilePic from '../assets/images/pierre.png';

export const FriendMock1 = {
  name: 'Karim Abdallah',
  email: 'karim_r_abdallah@yahoo.com',
  username: 'k',
  profilePic: pierreProfilePic,
  dashboard: {
    bookedPTO: {
      dates: [
        new Date('2023-06-05T12:00:00'),
        new Date('2023-06-06T12:00:00'),
        new Date('2023-06-07T12:00:00'),
        new Date('2023-06-08T12:00:00'),
      ],
    },
    holidays: [
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
        name: 'Independence Day',
        date: new Date('2023-07-04T12:00:00'),
        active: true,
      },
    ],
    PTOSettings: {
      annualAllowanceDays: 15,
      accrualCapDays: 10,
      currentBalanceDays: 4,
    },
  },
};

export const groupMock = {
  groupName: 'Trip to LA',
  groupId: '12345',
  friends: [FriendMock1],
  selectedDates: [],
  bookedDates: [],
};
