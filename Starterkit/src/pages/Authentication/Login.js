import React, { Component } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

// actions
import { checkLogin, apiError } from "../../store/actions";
import Logo from "../../assets/images/logo-vaccay.svg";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", showPassword: false };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, values) {
    event.preventDefault();
    let obj = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.checkLogin(obj, this.props.history);
  }

  handleShowPasswordToggle = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  handleEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  componentDidMount() {
    this.props.apiError("");
    document.body.classList.add("auth-body-bg");
  }

  componentWillUnmount() {
    document.body.classList.remove("auth-body-bg");
  }

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
                        <Link to="/home" className="mx-2">
                          <img
                            src={Logo}
                            className="img-fluid"
                            alt="vaccay-logo"
                          />
                        </Link>
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
                        <h3 className="mb-4">Welcome back!</h3>
                        {/* <div className="row">
                          <div className="col-lg-6 col-12">
                            <Link
                              to="/"
                              className="text-decoration-none social-btn px-2 mt-2 px-md-3 py-2 d-flex gap-3 flex-wrap align-items-center"
                            >
                              <img
                                src={google}
                                width={30}
                                className="img-fluid"
                                alt=""
                              />
                              <p>Sign up with Google</p>
                            </Link>
                          </div>
                          <div className="col-lg-6 col-12 lg:my-0 my-2">
                            <Link
                              to="/"
                              className="text-decoration-none social-btn px-2 px-md-3 -mt-4 py-2 d-flex gap-3 flex-wrap align-items-center"
                            >
                              <img
                                src={fb}
                                width={30}
                                className="img-fluid"
                                alt=""
                              />
                              <p>Sign up with Facebook </p>
                            </Link>
                          </div>
                        </div> */}
                        <form onSubmit={this.handleSubmit}>
                          <Row className="my-5">
                            <div>
                              {this.props.loginError
                                ? this.props.loginError
                                : null}
                              <Col className="my-4">
                                <input
                                  value={this.state.email}
                                  onChange={this.handleEmailChange}
                                  placeholder="Email Address"
                                  id="standard-email-input"
                                  label="Eamil Address"
                                  type="email"
                                  autoComplete="current-email"
                                  variant="standard"
                                  className="py-2 w-100 border-bottom border-0"
                                />
                              </Col>
                            </div>
                            <div>
                              <Col>
                                <div
                                  className="w-100 d-flex justify-content-between custom-textfield mt-3"
                                  variant="standard"
                                >
                                  <input
                                    type={
                                      this.state.showPassword
                                        ? "text"
                                        : "password"
                                    }
                                    onChange={this.handlePasswordChange}
                                    value={this.state.password}
                                    className=" w-100 border-bottom border-0"
                                    id="standard-adornment-password1"
                                    placeholder="Password"
                                  />
                                  <div onClick={this.handleShowPasswordToggle}>
                                    {this.state.showPassword ? (
                                      <div>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="20"
                                          height="20"
                                          fill="#C6C5C5"
                                          className="bi bi-eye"
                                          viewBox="0 0 16 16"
                                        >
                                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                        </svg>
                                      </div>
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="#C6C5C5"
                                        className="bi bi-eye-slash"
                                        viewBox="0 0 16 16"
                                      >
                                        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                                        <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                                        <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              </Col>
                            </div>
                            <div>
                              <button
                                type="submit"
                                className=" btn btn-submit w-100 mt-5"
                              >
                                Log in
                              </button>

                              <p className=" mt-3 forget">
                                <Link to="/forgot-password" className=" forget">
                                  {" "}
                                  Forgot my Password
                                </Link>{" "}
                              </p>
                              <p className="custom-link  mt-3">
                                Don’t have an account?{" "}
                                <Link to="/register" className="mx-2 forget">
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
  const { loginError } = state.Login;
  return { loginError };
};

export default withRouter(
  connect(mapStatetoProps, { checkLogin, apiError })(Login)
);
