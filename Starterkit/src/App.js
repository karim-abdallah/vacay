import React, { Component } from "react";
import { Switch, BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes
import { authProtectedRoutes, publicRoutes } from "./routes/";
import AppRoute from "./routes/route";

// layouts
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

import { initializeApp } from "firebase/app";
import ReactGA from "react-ga";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDROfNBM8eysxV01txzLBC8GxHLzcbAYiw",
  authDomain: "vacay-p1.firebaseapp.com",
  projectId: "vacay-p1",
  storageBucket: "vacay-p1.appspot.com",
  messagingSenderId: "1059695905619",
  appId: "1:1059695905619:web:92baf614ca77970ba66fa6",
  measurementId: "G-XG1YB0GB2S",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//Initialize Analytics and get a reference to the service
// const analytics = getAnalytics(app);
const TRACKING_ID = "UA-251789826-1"; // YOUR_OWN_TRACKING_ID
ReactGA.initialize(TRACKING_ID);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.getLayout = this.getLayout.bind(this);
  }

  /**
   * Returns the layout
   */
  getLayout = () => {
    let layoutCls = VerticalLayout;

    switch (this.props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout;
        break;
      default:
        layoutCls = VerticalLayout;
        break;
    }
    return layoutCls;
  };

  render() {
    const Layout = this.getLayout();

    return (
      <React.Fragment>
        <Router>
          <Switch>
            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={NonAuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}

            {authProtectedRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={Layout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    layout: state.Layout,
  };
};

export default connect(mapStateToProps, null)(App);
