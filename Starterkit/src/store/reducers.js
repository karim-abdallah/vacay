import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication Module
import Account from "./auth/register/reducer";
import Login from "./auth/login/reducer";
import Forget from "./auth/forgetpwd/reducer";
import Dashboard from "./dashboard/reducer";
import ResetPwd from './auth/resetpwd/reducer'

const rootReducer = combineReducers({
  // public
  Layout,

  // Authentication
  Account,
  Login,
  Forget,
  ResetPwd,
  // Dashboard
  Dashboard,
});

export default rootReducer;
