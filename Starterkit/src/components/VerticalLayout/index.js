import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth,
} from "../../store/actions";
import { pageTitle } from "../../constants";
import logout from "../../assets/images/logout.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { cardHoverColor } from "../../styles/constants";
import feedback from "../../assets/images/feedback.svg";

// Layout Related Components
import Sidebar from "./Sidebar";
import Footer from "./Footer";

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  capitalizeFirstLetter = (string) => {
    return string.charAt(1).toUpperCase() + string.slice(2);
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.isPreloader === true) {
        document.getElementById("preloader").style.display = "block";
        document.getElementById("status").style.display = "block";

        setTimeout(function () {
          document.getElementById("preloader").style.display = "none";
          document.getElementById("status").style.display = "none";
        }, 2500);
      } else {
        document.getElementById("preloader").style.display = "none";
        document.getElementById("status").style.display = "none";
      }
    }
  }

  componentDidMount() {
    // Scroll Top to 0
    window.scrollTo(0, 0);

    let currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    currentage = currentage.replaceAll("-", " ");

    document.title = currentage + " | " + pageTitle;

    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }

    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }
  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === "default") {
      this.props.changeSidebarType("condensed", this.state.isMobile);
    } else if (this.props.leftSideBarType === "condensed") {
      this.props.changeSidebarType("default", this.state.isMobile);
    }
  };

  render() {
    const goToFeedback = () => {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSewOeenbHvlcb2GK1uOXSvZ05iW8EATairwJbXPNHIk4lzDow/viewform"
      );
    };
    return (
      <React.Fragment>
        <div id="preloader">
          <div id="status">
            <div className="spinner">
              <i className="ri-loader-line spin-icon"></i>
            </div>
          </div>
        </div>
        <div>
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
          <div className="main-content">
            <Link to="/logout">
              {" "}
              <LogOutButton>
                <LogoutIcon src={logout} />
              </LogOutButton>
            </Link>{" "}
            <FeedBackButton onClick={goToFeedback}>
              <FeedBackButtonIcon src={feedback} />
            </FeedBackButton>
            {this.props.children}
            <Footer />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  return {
    ...state.Layout,
  };
};
export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth,
})(withRouter(Layout));

const LogoutIcon = styled.img`
  height: 17px;
`;

const LogOutButton = styled.button`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-right: 5px;
  float: right;
  background-color: #ffffff;
  height: 40px;
  width: 40px;
  margin-left: 5px;
  border-width: 0px;
  border-radius: 13px;
  position: relative;
  bottom: 8px;
  &:hover {
    background-color: ${(props) => !props.showpointer && cardHoverColor};
  }
`;

const FeedBackButtonIcon = styled.img`
  height: 18px;
`;

const FeedBackButton = styled.button`
  margin-top: 20px;
  margin-left: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  float: right;
  background-color: #ffffff;
  height: 40px;
  width: 40px;
  text-align: center;
  border-width: 0px;
  border-radius: 13px;
  position: relative;
  bottom: 8px;
  &:hover {
    background-color: ${(props) => !props.showpointer && cardHoverColor};
  }
`;
