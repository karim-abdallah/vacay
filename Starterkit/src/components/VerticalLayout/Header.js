import React, { Component } from "react";

import styled from "styled-components";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Import i18n
import { withNamespaces } from "react-i18next";

// Redux Store
import { toggleRightSidebar } from "../../store/actions";

//Import logo Images
import logosmdark from "../../assets/images/logo-sm-dark.png";
import logodark from "../../assets/images/logo-dark.png";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSearch: false,
      isSocialPf: false,
    };
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
  }
  /**
   * Toggle sidebar
   */
  toggleMenu() {
    this.props.toggleMenuCallback();
  }

  /**
   * Toggles the sidebar
   */
  toggleRightbar() {
    this.props.toggleRightSidebar();
  }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <header id="page-topbar">
          <div className="navbar-brand-box">
            <Link to="#" className="logo logo-dark">
              <span className="logo-sm">
                <img src={logosmdark} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logodark} alt="" height="20" />
              </span>
            </Link>

            <Link to="#" className="logo logo-light">
              <VacayLogo>VACAY</VacayLogo>
            </Link>
          </div>
        </header>
      </React.Fragment>
    );
  }
}

const VacayLogo = styled.div`
  font-family: "Poppins";
  font-style: normal;
  font-weight: 700;
  font-size: 55px;
  line-height: 100%;
  /* identical to box height, or 55px */

  color: #2b3674;
`;

const mapStatetoProps = (state) => {
  const { layoutType } = state.Layout;
  return { layoutType };
};

export default connect(mapStatetoProps, { toggleRightSidebar })(
  withNamespaces()(Header)
);
