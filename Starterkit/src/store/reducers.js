import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication Module
import Account from "./auth/register/reducer";
import Login from "./auth/login/reducer";
import Forget from "./auth/forgetpwd/reducer";
import Dashboard from "./dashboard/reducer";
import PlanWithFriends from "./planWithFriends/reducer";
import Profile from "./profile/reducer";

const rootReducer = combineReducers({
  // public
  Layout,

  // Authentication
  Account,
  Login,
  Forget,
  // Dashboard
  Dashboard,

  // Plan With Friends
  PlanWithFriends,

  // Profile Page
  Profile,
});

export default rootReducer;
