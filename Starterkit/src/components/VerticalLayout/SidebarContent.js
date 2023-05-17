import React, { Component } from "react";
import styled from "styled-components";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarType,
  changePreloader,
} from "../../store/actions";
// import logo from "../../assets/images/logo.png";
import logo from "../../assets/images/logo_homepage.svg";
import homeIcon from "../../assets/images/home.svg";
import profileIcon from "../../assets/images/profile.svg";
import highFiveIcon from "../../assets/images/high_five.svg";
import planeIcon from "../../assets/images/plane.svg";


class SidebarContent extends Component {
  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <StyledSidebar>
          <ul className="metismenu list-unstyled" id="side-menu">
            <Link to="/" className="logo logo-dark">
              <StyledLogo>
                <img src={logo} alt="" height="43" />
              </StyledLogo>
            </Link>
            <li>
              {
                <Link to="/dashboard">
                  
                  <img src={homeIcon} alt="" height="13" className="mb-1 side-icon"/>
                  <span className="sidebar-label" >{this.props.t(" Home")}</span>
                </Link>
              }
            </li>
            <li>
              {
                <Link to="/profile">
                  <img src={profileIcon} alt="" height="13" className="mb-1 side-icon" />
                  <span className="sidebar-label">{this.props.t(" Profile")}</span>
                </Link>
              }
            </li>
            <li>
              {
                <Link to="/dashboard">
                 <img src={highFiveIcon} alt="" height="14"  className="mb-1 side-icon"/>
                  <span className="sidebar-label">{this.props.t("Plan with friends")}</span>
                </Link>
              }
            </li>
            <li>
              {
                <Link to="/dashboard">
                  <img src={planeIcon} alt="" height="15" className="mb-1 side-icon"/>
                  <span className="sidebar-label" >{this.props.t(" Deals - coming soon")}</span>
                </Link>
              }
            </li>
          </ul> 
        </StyledSidebar>
      </React.Fragment>
    );
  }
}

const StyledLogo = styled.div`
  padding-bottom: 30px;
`;

const StyledSidebar = styled.div`
  text-align: left;
  padding-left: 20px;
`;

const mapStatetoProps = (state) => {
  return { ...state.Layout };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })(withNamespaces()(SidebarContent))
);
