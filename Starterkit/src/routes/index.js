import React from "react";
import { Redirect } from "react-router-dom";

import Home from "../pages/Authentication/Home";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";
import ResetPwd from "../pages/Authentication/ResetPassword";

//Onboarding
import OnBoarding from "../pages/OnBoarding";

// Dashboard
import Dashboard from "../pages/Dashboard/index";

// Profile
import Profile from "../pages/Profile/index";

// Inner Authentication
import Login1 from "../pages/AuthenticationInner/Login";
import Register1 from "../pages/AuthenticationInner/Register";
import ForgetPwd1 from "../pages/AuthenticationInner/ForgetPassword";


const authProtectedRoutes = [

	{ path: "/onboarding", component: OnBoarding },
	{ path: "/dashboard", component: Dashboard },
	{ path: "/profile", component: Profile },
	{ path: "/logout", component: Logout },
	
	// this route should be at the end of all other routes
	{ path: "/", exact: true, component: () => <Redirect to="/dashboard" /> },

];

const publicRoutes = [
	
	{ path: "/login", component: Login },
	{ path: "/reset-password/:token", component: ResetPwd },
	{ path: "/forgot-password", component: ForgetPwd },
	{ path: "/register", component: Register },
	{ path: "/lock-screen", component: AuthLockScreen },

	// Authentication Inner
	{ path: "/auth-login", component: Login1 },
	{ path: "/auth-register", component: Register1 },
	{ path: "/auth-recoverpw", component: ForgetPwd1 },

	{ path: "/home", component: Home },
];

export { authProtectedRoutes, publicRoutes };
