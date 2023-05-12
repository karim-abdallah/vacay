import { FETCH_TIMEOFF_SETTINGS } from './actionTypes';

export const fetchTimeOffSettings = timeOffSettings => {
  return { 
    type: FETCH_TIMEOFF_SETTINGS,
    payload: { timeOffSettings },
  };
};
