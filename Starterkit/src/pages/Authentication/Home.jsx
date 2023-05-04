import React from "react";
import { Container } from "reactstrap";
import Logo from "../../assets/images/logo-vaccay.svg";
import SideImg2 from "../../assets/images/side-img2.svg";
import Calendar1 from "../../assets/images/calendar_vac1.png";
import Cal02 from "../../assets/images/cal02.png";
import Calender3 from "../../assets/images/calender3.svg";
import SmallEarnings from "../../assets/images/Small_Earnings.svg";
import { useState, useEffect } from "react";
// Redux
import { Link } from "react-router-dom";
import { post } from "../../helpers/api_helper";

const Header = ({ isMobile, onGetStartedClick }) => {
  return (
    <div className="container">
      <div className="row justify-content-between">
        <div className="col-3 ">
          <img src={Logo} alt="vacay" />
        </div>
        {isMobile ? (
          <div className="col-5 offset-md-4">
            <button className="signup-btn" onClick={onGetStartedClick}>
              Get Started
            </button>
          </div>
        ) : (
          <>
            <div className="col-2 offset-md-5 text-end ">
              <button className="login-btn">
                <Link to="/login" className="routeme">
                  {" "}
                  Log in{" "}
                </Link>
              </button>
            </div>
            <div className="col-2 text-end">
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
            </div>
          </>
        )}
      </div>
      <hr className="hr-for-header" />
    </div>
  );
};

const GetStarted = () => {
  const [isRemindMe, setRemindMe] = useState(true);
  const [isSubmit, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleRemindMeScreen = () => {
    setRemindMe(false);
  };

  const handleThankYouScreen = () => {
    setSubmit(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address");
    } else {
      handleThankYouScreen();
      setEmail("");
      setErrorMessage("");
    }
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div className="getstart-container">
      <img src={Logo} alt="vacay" />
      <hr className="hr-for-header" />

      {isSubmit ? (
        <div className="col-md-7 thank-screen">
          <p className="getstart-heading">
            Thank you for subscribing and stay tuned for updates!
          </p>
        </div>
      ) : isRemindMe ? (
        <>
          <div className="col-md-7 ">
            <p className="getstart-heading">
              We’re desktop-only for now, but we've got your back! Click to get
              a reminder and come back later.
            </p>
            <div className="get-start-btn">
              <button className="signup-btn" onClick={handleRemindMeScreen}>
                Remind Me
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="col-md-7">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="remindme-label">Email</label>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="form-control remindme-input input-field"
                  onChange={handleEmailChange}
                  value={email}
                />
              </div>
              <div className="getstart-btn">
                <button className="signup-btn" type="Submit">
                  Submit
                </button>
              </div>
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}
            </form>
          </div>
        </>
      )}
      <div className="col-md-5 col-12 ">
        <img src={SideImg2} alt="side-img" className="side-img mb-screen" />
      </div>
    </div>
  );
};

const Banner = ({ isMobile, onGetStartedClick }) => {
  return (
    <div className="container banner-content">
      <div className="row">
        <div className="col-md-6">
          <h1 className="main-heading">
            Make booking time off a task to look forward to
          </h1>
          <p className="sub-heading">
            Optimize your time off using our user-friendly interface and
            forward-looking balances. Sync with friends to plan the perfect
            vacation together.
          </p>
          <div className="get-start-btn">
            {isMobile ? (
              <div>
                <button className="signup-btn" onClick={onGetStartedClick}>
                  Get Started &gt;
                </button>
              </div>
            ) : (
              <div>
                <Link to="/register">
                  <button className="signup-btn">Get Started &gt;</button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="col-md-5 col-12 ">
          {/* <img src={SideImg2} alt="side-img" className="side-img" /> */}
          <lottie-player
            className="side-img lottie-player"
            src="https://assets5.lottiefiles.com/packages/lf20_vezxxffq.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          >
          </lottie-player>
        </div>
      </div>
    </div>
  );
};

const Planner = () => {
  return (
    <div>
      <div className="planner-heading">
        <p>
          Your <span className="planner-heading-color">personal time off</span>{" "}
          planner
        </p>
      </div>
      <div className="container">
        <div className="row my-5 planner-boxes justify-content-center">
          <div className="col-md-4 ">
            <div className="screens sc-1 ">
              <h4 className="box-heading">
                Easily book and store your days off
              </h4>
              <h5 className="box-sub-heading">
                Book your PTO with just a few clicks and store all your bookings
                in one place.
              </h5>
              <br></br>
              <img
                src={Calendar1}
                className="planner-img"
                alt="calender1"
              />
              <br />
              <br />
              <img src={Cal02} className="planner-img" alt="calender2" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="screens sc-2 ">
              <h4 className="box-heading">Visualize and forecast your PTO</h4>
              <h5 className="box-sub-heading">
                See how much time off you have left and plan your next vacation
                with ease.
              </h5>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <img src={Calender3} className="planner-img" alt="calender1" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="screens sc-3 ">
              <h4 className="box-heading">
                Plan with friends & family, seamlessly
              </h4>
              <h5 className="box-sub-heading">
                Plan trips together based on availability and easily sync
                calendars.
              </h5>
              <img
                src={SmallEarnings}
                className="planner-sc3-image"
                alt="calender1"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="signup-btn-container">
        <Link to="/register">
          <button className="signup-btn">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address");
    } else {
      try {
        let obj = { email: email };
        await post("/subscribe", obj);
        setIsSubscribed(true);
        setEmail("");
      } catch (error) {
        setErrorMessage(error.data.detail);
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMessage("");
  };

  const subscribedStyle = {
    color: "white",
    fontSize: "13px",
    marginTop: "11px",
    marginLeft: "7px",
  };

  return (
    <div className="footer-container">
      <hr className="hr-for-header" />

      <img src={Logo} alt="vacay" />
      <div className="footer-section">
        <form onSubmit={handleFormSubmit}>
          <div className="form-group footer-input">
            <input
              value={email}
              type="email"
              placeholder="Your email address"
              className="form-control input-field"
              onChange={handleEmailChange}
            />

            {isSubscribed ? (
              <h5 style={subscribedStyle}>Subscribed</h5>
            ) : (
              <button className="footer-btn" type="Submit">
                {" "}
                Subscribe{" "}
              </button>
            )}
          </div>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  );
};

const Landing = () => {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScreenWidthChange = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleScreenWidthChange);
    handleScreenWidthChange();

    return () => {
      window.removeEventListener("resize", handleScreenWidthChange);
    };
  }, []);

  const handleGetStartedClick = () => {
    setShowGetStarted(true);
    setShowContent(false);
  };
  return (
    <React.Fragment>
      <div className="landing-container">
        <Container>
          {showContent && (
            <>
              <Header
                isMobile={isMobile}
                onGetStartedClick={handleGetStartedClick}
              />
              <Banner
                isMobile={isMobile}
                onGetStartedClick={handleGetStartedClick}
              />
              <Planner />
              <Footer />
            </>
          )}
          {showGetStarted && <GetStarted />}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Landing;
