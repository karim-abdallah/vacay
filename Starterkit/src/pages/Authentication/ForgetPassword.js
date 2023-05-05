import React, { Component } from "react";
import { Row, Col } from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// action
import { forgetUser } from "../../store/actions";


import Logo from "../../assets/images/logo-vaccay.svg";

class ForgetPasswordPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };

    // handleValidSubmit
    this.handleValidSubmit = this.handleValidSubmit.bind(this);
  }

  // handleValidSubmit
  handleValidSubmit(event) {
    event.preventDefault();
    let obj = {
      email: this.state.email
    }
    this.props.forgetUser(obj, this.props.history);
  }

  //
  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  render() {
    return (
      <React.Fragment>
        <div className="d-flex justify-content-between flex-column min-vh-100">
          <div className="Login-form">
            <div className="container-fluid m-0">
              <div className="row">
                <div className="col-lg-4 col-md-5 vh-100 align-items-center p-0 d-none d-md-block">
                  <div className="div">
                    <div className="content-section mt-5 pt-5">
                      <div className="d-flex gap-2 flex-wrap align-items-center">
                      <img src={Logo} className="img-fluid" alt="vaccay-logo" />
                      </div>
                      <p>Optimize your time off</p>
                    </div>
                    <lottie-player
            className="side-img"
            src="https://lottie.host/063c8109-dcfe-4653-af8d-4a660ab64413/md0nTOGoY3.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
                  </div>
                </div>
                <div className="col-lg-8  col-md-7 p-0">
                  <div className="form-card d-flex align-items-center px-0 px-lg-5">
                    <div>
                      <div className="container md:px-3 px-md-5">
                        <p>
                          Enter the email address associated with your account
                          and we'll send you a link to reset your password
                        </p>
                        <form onSubmit={this.handleValidSubmit}>
                          <Row className="my-5">
                            <div>
                              {this.props.forgetError ? this.props.forgetError : null}
                              {this.props.message ? this.props.message : null}
                              <p className="custom-link mt-3">Email Address:</p>
                              <Col className="my-4">
                                <input
                                  value={this.state.email}
                                  onChange={this.handleEmailChange}
                                  id="standard-email-input"
                                  label="Email Address"
                                  type="email"
                                  autoComplete="current-email"
                                  variant="standard"
                                  className="py-2 px-2 w-100"
                                  style={{ borderRadius: "4px", border:"1px solid #2b3674ab"  }}
                                />
                              </Col>
                            </div>

                            <div>
                              <button
                                type="submit"

                                className="btn btn-submit w-100 mt-5">
                                Continue
                              </button>
                              <p className="custom-link mt-3">
                                Don’t have an account?
                                <Link to="/register" className="mx-2">
                                  {" "}
                                  <p className="forget">Sign up</p>
                                </Link>{" "}
                              </p>
                            </div>
                          </Row>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  const { message, forgetError, loading } = state.Forget;
  return { message, forgetError, loading };
};

export default withRouter(
  connect(mapStatetoProps, { forgetUser })(ForgetPasswordPage)
);
