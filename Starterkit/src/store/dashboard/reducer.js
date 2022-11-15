import { mockApiResponse } from "../../mocks/dashboardSummary.mock";

const INIT_STATE = {
  currentMonth: mockApiResponse.currentMonth,
  currentBalanceDays: mockApiResponse.currentBalanceDays,
  bookedPTO: mockApiResponse.bookedPTO,
  holidays: mockApiResponse.holidays,
  accrualRate: mockApiResponse.accrualRate,
  accrualCap: mockApiResponse.accrualCap,
  selectedDays: new Set(),
};

const Dashboard = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "currentMonth/update":
      return {
        ...state,
        currentMonth: action.payload,
      };
    case "bookedPTO/add":
      return {
        ...state,
        bookedPTO: {
          dates: state.bookedPTO.dates.concat(action.payload),
        },
      };
    case "selectedDays/add":
      return {
        ...state,
        selectedDays: state.selectedDays.add(action.payload),
      };
    case "selectedDays/delete":
      return {
        ...state,
        selectedDays: state.selectedDays.delete(action.payload),
      };

    default:
      return state;
  }
};

export default Dashboard;
