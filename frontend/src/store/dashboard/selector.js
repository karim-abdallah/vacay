export const selectDashboardData = state => {
  const adjustedDashboard = {
    currentMonth: state.Dashboard.currentMonth,
    bookedPTO: state.Dashboard.bookedPTO,
    holidays: state.Dashboard.holidays.filter(x => x.active).map(x => x.date),
    accrualType: state.Dashboard.PTOSettings.accrualType,
    accrualRate: state.Dashboard.PTOSettings.annualAllowanceDays / 12,
    currentBalanceDays: state.Dashboard.PTOSettings.currentBalanceDays,
    accrualCap: state.Dashboard.PTOSettings.accrualCapDays,
  };
  return adjustedDashboard;
};

export const getCurrentMonth = state => {
  return state.Dashboard.currentMonth;
};

export const getSelectedDates = state => {
  return state.Dashboard.selectedDates;
};

export const getDatesToUnbook = state => {
  return state.Dashboard.datesToUnbook;
};

export const selectBookedPTO = state => {
  return state.Dashboard.bookedPTO.dates;
};

export const selectHolidaysDates = state => {
  // Returns dates for active holidays
  return state.Dashboard.HOLIDAYSettings.filter(x => x.active).map(x => x.date);
};

export const getHolidays = state => {
  // returns holidays with names
  const settings = {
    HOLIDAYSettings: state.Dashboard.HOLIDAYSettings,
  };
  return settings;
};

export const getPTOSettings = state => {
  const settings = {
    currentMonth: state.Dashboard.currentMonth,
    PTOSettings: state.Dashboard.PTOSettings,
    vacationSettings: state.Dashboard.VacationSettings,
  };
  return settings;
};

export const getNegativeBalanceMonths = state => {
  return state.Dashboard.negativeBalanceMonths;
};
