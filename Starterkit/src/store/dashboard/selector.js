export const selectDashboardData = (state) => {
  const adjustedDashboard = {
    currentMonth: state.Dashboard.currentMonth,
    bookedPTO: state.Dashboard.bookedPTO,
    holidays: state.Dashboard.holidays,
    accrualRate:
      (state.Dashboard.PTOSettings.annualAllowanceDays +
        state.Dashboard.VacationSettings.annualAllowanceDays) /
      12,
    currentBalanceDays:
      state.Dashboard.PTOSettings.currentBalanceDays +
      state.Dashboard.VacationSettings.currentBalanceDays,
    accrualCap:
      state.Dashboard.PTOSettings.accrualCapDays +
      state.Dashboard.VacationSettings.accrualCapDays,
  };
  return adjustedDashboard;
};

export const getSelectedDates = (state) => {
  return state.Dashboard.selectedDates;
};

export const getDatesToUnbook = (state) => {
  return state.Dashboard.datesToUnbook;
};

export const selectBookedPTO = (state) => {
  return state.Dashboard.bookedPTO.dates;
};

export const selectHolidays = (state) => {
  return state.Dashboard.holidays.dates;
};

export const getPTOSettings = (state) => {
  const settings = {
    currentMonth: state.Dashboard.currentMonth,
    holidays: state.Dashboard.holidays,
    PTOSettings: state.Dashboard.PTOSettings,
    vacationSettings: state.Dashboard.VacationSettings,
  };
  return settings;
};
