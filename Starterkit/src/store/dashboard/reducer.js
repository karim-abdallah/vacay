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
  datesToUnbook: [],
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
      return {
        ...state,
        selectedDates: state.selectedDates.filter(
          (x) => !isSameDay(x, action.payload)
        ),
      };
    case "datesToUnbook/add":
      return {
        ...state,
        datesToUnbook: [...state.datesToUnbook, action.payload],
      };

    case "datesToUnbook/delete":
      return {
        ...state,
        datesToUnbook: state.datesToUnbook.filter(
          (x) => !isSameDay(x, action.payload)
        ),
      };
    default:
      return state;
  }
};

export default Dashboard;
