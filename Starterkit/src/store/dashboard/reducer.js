import { mockApiResponse } from '../../mocks/dashboardSummary.mock';
import { isSameDay } from '../../helpers/vacay_helpers';

const INIT_STATE = {
  currentMonth: mockApiResponse.currentMonth,
  bookedPTO: mockApiResponse.bookedPTO,
  holidays: mockApiResponse.holidays,
  PTOSettings: mockApiResponse.PTOSettings,
  selectedDates: [],
  datesToUnbook: [],
  negativeBalanceMonths: [],
};

const Dashboard = (state = INIT_STATE, action) => {
  switch (action.type) {
    case 'currentMonth/update':
      return {
        ...state,
        currentMonth: action.payload,
      };
    case 'bookedPTO/add':
      // de-dupe additions
      const dedupedDates = action.payload.filter(
        x =>
          !isSameDay(
            x,
            state.bookedPTO.dates.find(y => isSameDay(x, y))
          )
      );
      return {
        ...state,
        bookedPTO: {
          dates: state.bookedPTO.dates.concat(dedupedDates),
        },
      };
    case 'bookedPTO/delete':
      return {
        ...state,
        bookedPTO: {
          dates: state.bookedPTO.dates.filter(
            x => !isSameDay(x, action.payload)
          ),
        },
      };
    case 'selectedDates/add':
      return {
        ...state,
        selectedDates: [...state.selectedDates, action.payload],
      };
    case 'selectedDates/delete':
      return {
        ...state,
        selectedDates: state.selectedDates.filter(
          x => !isSameDay(x, action.payload)
        ),
      };
    case 'datesToUnbook/add':
      return {
        ...state,
        datesToUnbook: [...state.datesToUnbook, action.payload],
      };

    case 'datesToUnbook/delete':
      return {
        ...state,
        datesToUnbook: state.datesToUnbook.filter(
          x => !isSameDay(x, action.payload)
        ),
      };
    case 'settings/update':
      const accrualType = action.payload.ptoAccrualType
        ? action.payload.ptoAccrualType
        : state.PTOSettings.accrualType;
      return {
        ...state,
        PTOSettings: {
          ...state.PTOSettings,
          accrualType: accrualType,
          annualAllowanceDays: action.payload.ptoAllowance,
          accrualCapDays: action.payload.ptoCap,
          currentBalanceDays: action.payload.ptoBalance,
        },
      };
    case 'holidays/update':
      // Takes in list of active holidays by name. Ex:
      // ['Labor Day', 'New Year's Day']

      return {
        ...state,
        holidays: state.holidays.map(x => {
          if (action.payload.find(day => day === x.name)) {
            x.active = true;
          } else {
            x.active = false;
          }
          return x;
        }),
      };

    case 'negativeBalanceMonths/update':
      return {
        ...state,
        negativeBalanceMonths: [...action.payload],
      };

    default:
      return state;
  }
};

export default Dashboard;
