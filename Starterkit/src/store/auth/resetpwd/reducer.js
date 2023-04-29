import { RESET_USER, RESET_USER_SUCCESSFUL, RESET_PASSWORD_API_FAILED } from './actionTypes';

const initialState = {
    resetError: null, message: null, loading: false
}

const resetpwd = (state = initialState, action) => {
    switch (action.type) {
        case RESET_USER:
            state = {
                ...state,
                user: null,
                loading: true,
                resetError: null
            }
            break;
        case RESET_USER_SUCCESSFUL:
            state = {
                ...state,
                loading: false,
                message: action.payload
            }
            break;
        case RESET_PASSWORD_API_FAILED:
            state = {
                ...state,
                loading: false,
                resetError: action.payload
            }
            break;
        default:
            state = { ...state };
            break;
    }
    return state;
}

export default resetpwd;