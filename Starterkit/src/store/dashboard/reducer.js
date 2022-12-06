import { mockApiResponse } from "../../mocks/dashboardSummary.mock";
import { isSameDay } from "../../helpers/vacay_helpers";

const INIT_STATE = {
  currentMonth: mockApiResponse.currentMonth,
  bookedPTO: mockApiResponse.bookedPTO,
  holidays: mockApiResponse.holidays,
  PTOSettings: {
    annualAllowanceDays: mockApiResponse.PTOSettings.annualAllowanceDays,
    accrualCapDays: mockApiResponse.PTOSettings.accrualCapDays,
    currentBalanceDays: mockApiResponse.PTOSettings.currentBalanceDays,
  },
  VacationSettings: {
    annualAllowanceDays: mockApiResponse.VacationSettings.annualAllowanceDays,
    accrualCapDays: mockApiResponse.VacationSettings.accrualCapDays,
    currentBalanceDays: mockApiResponse.VacationSettings.currentBalanceDays,
  },
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
      // de-dupe additions
      const dedupedDates = action.payload.filter(
        (x) =>
          !isSameDay(
            x,
            state.bookedPTO.dates.find((y) => isSameDay(x, y))
          )
      );
      return {
        ...state,
        bookedPTO: {
          dates: state.bookedPTO.dates.concat(dedupedDates),
        },
      };
    case "bookedPTO/delete":
      return {
        ...state,
        bookedPTO: {
          dates: state.bookedPTO.dates.filter(
            (x) => !isSameDay(x, action.payload)
          ),
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
    case "settings/update":
      return {
        ...state,
        PTOSettings: {
          annualAllowanceDays: action.payload.ptoAllowance,
          accrualCapDays: action.payload.ptoCap,
          currentBalanceDays: action.payload.ptoBalance,
        },
        VacationSettings: {
          annualAllowanceDays: action.payload.vacationAllowance,
          accrualCapDays: action.payload.vacationCap,
          currentBalanceDays: action.payload.vacationBalance,
        },
      };
    case "holidays/update":
      console.log("updating holiday");
      // Takes in all active holidays
      // Should find the one that isn't in the list, and set it to false. Otherwise set them all to true
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default Dashboard;
