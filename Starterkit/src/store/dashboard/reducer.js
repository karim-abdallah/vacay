import { mockApiResponse } from "../../mocks/dashboardSummary.mock";

const INIT_STATE = {
  currentMonth: mockApiResponse.currentMonth,
  currentBalanceDays: mockApiResponse.currentBalanceDays,
  bookedPTO: mockApiResponse.bookedPTO,
  holidays: mockApiResponse.holidays,
  accrualRate: mockApiResponse.accrualRate,
  accrualCap: mockApiResponse.accrualCap,
};

const Dashboard = (state = INIT_STATE, action) => {
  switch (action.type) {
    case "currentMonth/update":
      return {
        ...state,
        currentMonth: action.payload,
      };
    case "bookedPTO/add":
      console.log("action dispatched");
      return {
        ...state,
        bookedPTO: {
          dates: [...state.bookedPTO.dates, action.payload],
        },
      };
    default:
      return state;
  }
};

export default Dashboard;
