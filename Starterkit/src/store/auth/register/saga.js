import { takeEvery, fork, put, all, call } from 'redux-saga/effects';

//Account Redux states
import { REGISTER_USER } from './actionTypes';
import { registerUserSuccessful, registerUserFailed } from './actions';

//AUTH related methods
import { postRegister } from '../../../helpers/fackBackend_Helper';


// Is user register successfull then direct plot user in redux.
function* registerUser({ payload: { user, history } }) {
    try {
        const response = yield call(postRegister, '/register', user);
        yield put(registerUserSuccessful(response));
        history.push('/login');
    } catch (error) {
        yield put(registerUserFailed(error));
    }
}

export function* watchUserRegister() {
    yield takeEvery(REGISTER_USER, registerUser)
}

function* accountSaga() {
    yield all([fork(watchUserRegister)]);
}

export default accountSaga;