import React, { Component } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from 'react-router-dom';

// action
import {
  registerUser,
  registerUserFailed,
  apiError,
} from '../../store/actions';


// Redux
import { connect } from 'react-redux';

import Logo from '../../assets/images/logo-vaccay.svg';
import google from '../../assets/images/google-btn.svg';
import facebook from '../../assets/images/fb-btn.svg';

// REST API
import { get } from "../../helpers/api_helper";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      showPassword: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, values) {
    event.preventDefault();

    let obj = {
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    };
    this.props.registerUser(obj, this.props.history);
  }

  handleShowPasswordToggle = () => {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  };

  fetchOauthRedirect = async (provider) => {
    try {
      let response = await get(`/auth/oauth-link?oauth_provider=${provider}`)
      window.location.assign(response.data);
    }
    catch (err) {
      console.log(err)
    }
  };

  componentDidMount() {
    this.props.registerUserFailed('');
    this.props.apiError('');
    document.body.classList.add('auth-body-bg');
  }

  handleEmailChange = e => {
    this.setState({
      email: e.target.value,
    });
  };

  handlePasswordChange = e => {
    if (e.target.value.length >= 8 && e.target.value.length <= 20) {
      this.setState({
        password: e.target.value,
        passwordError: null,
        isPasswordValid: true,
      });
    } else {
      this.setState({
        password: e.target.value,
        passwordError:
          'Password must be between 8 and 20 characters. Please choose another',
        isPasswordValid: false,
      });
    }
  };

  handleFirstNameChange = e => {
    this.setState({
      firstName: e.target.value,
    });
  };

  handleLastNameChange = e => {
    this.setState({
      lastName: e.target.value,
    });
  };

  render() {
    return (
      <React.Fragment>
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
                    src="https://vacay-assets.s3.amazonaws.com/lottie.json"
                    background="transparent"
                    speed="1"
                    loop
                    autoplay
                  ></lottie-player>
                </div>
              </div>
              <div className="col-lg-8 col-md-7 p-0">
                <div className="form-card d-flex align-items-center px-0 px-lg-5">
                  <div>
                    <div className="container md:px-3 px-md-5">
                      <h3 className="mb-4">Create Account</h3>
                      <div className="row">
                        <div className="col-lg-6 col-12">
                          <button
                            onClick={() => this.fetchOauthRedirect('google')}
                            className="text-decoration-none social-btn px-2 mt-2 px-md-3 py-2 d-flex gap-3 flex-wrap align-items-center"
                          >
                            <img
                              src={google}
                              width={30}
                              className="img-fluid"
                              alt=""
                            />
                            <p>Sign up with Google</p>
                          </button>
                        </div>
                        <div className="col-lg-6 col-12 lg:my-0 my-2">
                          <button
                            onClick={() => this.fetchOauthRedirect('facebook')}
                            className="text-decoration-none social-btn px-2 px-md-3 -mt-4 py-2 d-flex gap-3 flex-wrap align-items-center"
                          >
                            <img
                              src={facebook}
                              width={30}
                              className="img-fluid"
                              alt=""
                            />
                            <p>Sign up with Facebook </p>
                          </button>
                        </div>
                      </div>
                      <form onSubmit={this.handleSubmit}>
                        {this.props.registrationError
                          ? this.props.registrationError
                          : null}
                        <Row className="my-5">
                          <Col>
                            <input
                              value={this.state.firstName}
                              onChange={this.handleFirstNameChange}
                              id="standard-lastName-input"
                              placeholder="First Name"
                              type="text"
                              autoComplete="current-lastName"
                              variant="standard"
                              className=" w-100 py-2 handle-border"
                            />
                          </Col>
                          <Col>
                            <input
                              value={this.state.lastName}
                              onChange={this.handleLastNameChange}
                              placeholder="Last Name"
                              id="standard-firstName-input"
                              label="First Name"
                              type="text"
                              autoComplete="current-firstName"
                              variant="standard"
                              className="py-2 w-100 handle-border"
                            />
                          </Col>
                        </Row>
                        <Row className="my-5">
                          <Col>
                            <input
                              value={this.state.email}
                              onChange={this.handleEmailChange}
                              placeholder="Email Address"
                              id="standard-email-input"
                              label="Eamil Address"
                              type="email"
                              autoComplete="current-email"
                              variant="standard"
                              className="py-2 w-100 handle-border"
                            />
                          </Col>

                          {/* <Col>
                            <input
                              value={this.state.username}
                              onChange={this.handleUsernameChange}
                              placeholder="Username"
                              id="standard-username-input"
                              label="Username"
                              type="text"
                              autoComplete="current-username"
                              variant="standard"
                              className="py-2 w-100 handle-border"
                            />
                          </Col> */}

                          <Row className="my-5">
                            <Col>
                              <div
                                className="w-100 d-flex justify-content-between custom-textfield mt-3"
                                variant="standard"
                              >
                                <input
                                  type={
                                    this.state.showPassword
                                      ? 'text'
                                      : 'password'
                                  }
                                  value={this.state.password}
                                  onChange={this.handlePasswordChange}
                                  className={
                                    'w-100 handle-border ' +
                                    (this.state.passwordError
                                      ? 'is-invalid'
                                      : '')
                                  }
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
                                      width="16"
                                      height="16"
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
                              {this.state.passwordError && (
                                <div className="invalid-password pt-2">
                                  {this.state.passwordError}
                                </div>
                              )}
                            </Col>
                          </Row>
                          <div>
                            <button
                              type="submit"
                              className=" btn btn-submit w-100 mt-5"
                              disabled={!this.state.isPasswordValid}
                            >
                              Create Account
                            </button>

                            <p className="custom-link mt-3">
                              Already have an account?{' '}
                              <Link to="/login" className="mx-2">
                                {' '}
                                <p className="forget">Log in</p>
                              </Link>{' '}
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
      </React.Fragment>
    );
  }
}

const mapStatetoProps = state => {
  const { registrationError, loading } = state.Account;
  return { registrationError, loading };
};

export default connect(mapStatetoProps, {
  registerUser,
  apiError,
  registerUserFailed,
})(Register);
