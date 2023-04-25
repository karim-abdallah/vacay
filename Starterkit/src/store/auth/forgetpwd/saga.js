import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { FORGET_USER } from "./actionTypes";
import { forgetUserSuccessful, userForgetPasswordError } from "./actions";

// AUTH related methods
import { postForgetPwd } from "../../../helpers/fackBackend_Helper";


//If user is login then dispatch redux action's are directly from here.
function* forgetUser({ payload: { email, history } }) {

  try {

    yield call(postForgetPwd, "/forgot-password", email);

    yield put(
      forgetUserSuccessful(
        "Password request link sent to your email. Please check your email"
      )
    );
  } catch (error) {

    yield put(userForgetPasswordError(error));
  }
}

export function* watchUserForget() {
  yield takeEvery(FORGET_USER, forgetUser);
}

function* forgetSaga() {
  yield all([fork(watchUserForget)]);
}

export default forgetSaga;
