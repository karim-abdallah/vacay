export const selectDashboardData = (state) => {
  return state.Dashboard;
};

export const selectBookedPTO = (state) => {
  const dates = state.Dashboard.bookedPTO.dates;
  return dates.map((date) => new Date(date));
};

export const selectHolidays = (state) => {
  const dates = state.Dashboard.holidays.dates;
  return dates.map((date) => new Date(date));
};
