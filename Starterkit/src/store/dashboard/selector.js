export const selectDashboardData = (state) => {
  return state.Dashboard;
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
