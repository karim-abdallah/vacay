import { RESET_USER, RESET_USER_SUCCESSFUL, RESET_PASSWORD_API_FAILED } from './actionTypes';

export const resetUser = (obj, history) => {
    return {
        type: RESET_USER,
        payload: { obj, history }
    }
}

export const resetUserSuccessful = (message) => {
    return {
        type: RESET_USER_SUCCESSFUL,
        payload: message
    }
}

export const userResetPasswordError = (error) => {
    return {
        type: RESET_PASSWORD_API_FAILED,
        payload: error
    }
}