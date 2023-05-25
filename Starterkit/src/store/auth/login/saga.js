import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

// Login Redux States
import { CHECK_LOGIN, LOGOUT_USER } from './actionTypes';
import { apiError, loginUserSuccessful, logoutUserSuccess } from './actions';

// AUTH related methods
import { postLogin } from '../../../helpers/fackBackend_Helper';


//If user is login then dispatch redux action's are directly from here.
function* loginUser({ payload: { user, history } }) {
    try {
        const response = yield call(postLogin, '/auth/login', user);

        localStorage.setItem("access_token", response.access);
        localStorage.setItem("refresh_token", response.refresh);

        yield put(loginUserSuccessful(response.token));

        if (response.is_logged_in) {
            history.push('/dashboard');
        } else {
            history.push('/onboarding');
        }

    } catch (error) {
        yield put(apiError(error));
    }
}

function* logoutUser({ payload: { history } }) {
    try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        const response = yield call(postLogin, '/auth/logout');
        yield put(logoutUserSuccess(response));
        history.push('/login');
    } catch (error) {
        yield put(apiError(error));
    }
}

export function* watchUserLogin() {
    yield takeEvery(CHECK_LOGIN, loginUser)
}

export function* watchUserLogout() {
    yield takeEvery(LOGOUT_USER, logoutUser)
}

function* loginSaga() {
    yield all([
        fork(watchUserLogin),
        fork(watchUserLogout),
    ]);
}

export default loginSaga;