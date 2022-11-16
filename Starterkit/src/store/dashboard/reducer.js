import { mockApiResponse } from "../../mocks/dashboardSummary.mock";
import { isSameDay } from "../../helpers/vacay_helpers";

const INIT_STATE = {
  currentMonth: mockApiResponse.currentMonth,
  currentBalanceDays: mockApiResponse.currentBalanceDays,
  bookedPTO: mockApiResponse.bookedPTO,
  holidays: mockApiResponse.holidays,
  accrualRate: mockApiResponse.accrualRate,
  accrualCap: mockApiResponse.accrualCap,
  selectedDates: [],
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
    case "selectedDates/add":
      return {
        ...state,
        selectedDates: [...state.selectedDates, action.payload],
      };
    case "selectedDates/delete":
      const dedupedDates = new Set();
      for (let n = 0; n < action.payload.length; n++) {
        dedupedDates.add(state.selectedDates[n]);
      }
      for (let n = 0; n < state.selectedDates.length; n++) {
        for (let m = 0; m < action.payload.length; m++) {
          if (isSameDay(state.selectedDates[n], action.payload[m])) {
            dedupedDates.delete(action.payload[n]);
            break;
          }
        }
      }
      return {
        ...state,
        selectedDates: [...dedupedDates],
      };

    default:
      return state;
  }
};

export default Dashboard;
