import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { RESET_USER } from "./actionTypes";
import { resetUserSuccessful, userResetPasswordError } from "./actions";

// AUTH related methods
import { postResetPwd } from "../../../helpers/fackBackend_Helper";


//If user is login then dispatch redux action's are directly from here.
function* resetUser({ payload: { obj, history } }) {

  try {
    console.log(obj)
    const response = yield call(postResetPwd, "/reset-password", obj);
    yield put(resetUserSuccessful(response));
    history.push('/login');

  } catch (error) {
    yield put(userResetPasswordError(error));
  }
}

export function* watchUserReset() {
  yield takeEvery(RESET_USER, resetUser);
}

function* resetSaga() {
  yield all([fork(watchUserReset)]);
}

export default resetSaga;
