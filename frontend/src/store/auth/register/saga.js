import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

//Account Redux states
import { REGISTER_USER } from './actionTypes';
import { registerUserSuccessful, registerUserFailed } from './actions';
import { loginUserSuccessful } from '../login/actions';

//AUTH related methods
import { postRegister, postLogin } from '../../../helpers/fackBackend_Helper';

// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user, history } }) {
  try {
    const response = yield call(postRegister, '/auth/register', user);
    yield put(registerUserSuccessful(response));

    const response1 = yield call(postLogin, '/auth/login', user);
    localStorage.setItem("access_token", response1.access);
    localStorage.setItem("refresh_token", response1.refresh);
    yield put(loginUserSuccessful(response1.access));

    history.push('/onboarding');
  } catch (error) {
    yield put(registerUserFailed(error));
  }
}

export function* watchUserRegister() {
  yield takeEvery(REGISTER_USER, registerUser);
}

function* accountSaga() {
  yield all([fork(watchUserRegister)]);
}

export default accountSaga;
