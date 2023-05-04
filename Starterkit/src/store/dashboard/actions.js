import {
  FETCH_TIMEOFF_SETTINGS,
  FETCH_TIMEOFF_SETTINGS_SUCCEEDED,
  FETCH_TIMEOFF_SETTINGS_FAILED,
} from './actionTypes';

export const fetchTimeOffSettings = timeOffSettings => {
  return {
    type: FETCH_TIMEOFF_SETTINGS,
    payload: { timeOffSettings },
  };
};
