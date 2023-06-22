import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "reactstrap";
import SmallEarnings from "../../assets/images/Small_Earnings.svg";
import Cal02 from "../../assets/images/cal02.svg";
import Calendar1 from "../../assets/images/calendar_vac1.svg";
import Calender3 from "../../assets/images/calender3.svg";
import pic1 from "../../assets/images/ht-tool.svg";
import pic2 from "../../assets/images/people.svg";
import pic3 from "../../assets/images/analytics.svg";
import Logo from "../../assets/images/logo-vaccay.svg";
import personalimg from "../../assets/images/personal.svg";
import businessImg from "../../assets/images/business.svg";
// Redux
import { Link } from "react-router-dom";
import { post } from "../../helpers/api_helper";

const Header = ({ isMobile, onGetStartedClick, personal }) => {
  return (
    <section>
      <div className="row justify-content-between mobile-logo">
        {isMobile ? (
          <>
            <div className="col-3 ">
              <Link to="/home" className="mx-2">
                <img src={Logo} alt="vacay" className="logo" />
              </Link>
            </div>
            <div className="col-5 offset-md-4">
              <button className="signup-btn" onClick={onGetStartedClick}>
                Get Started
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="col-3 ">
              <Link to="/home" className="mx-2">
                <img src={Logo} alt="vacay" />
              </Link>
            </div>

            <div
              className="col-2 offset-md-5 text-end "
              style={personal === true ? { display: "none" } : {}}
            >
              <button className="login-btn">
                <Link to="/login" className="routeme">
                  {" "}
                  Log in{" "}
                </Link>
              </button>
            </div>
            <div
              className="col-2 text-end"
              style={personal === true ? { display: "none" } : {}}
            >
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
            </div>
            {personal === true && (
              <div className="col-2 text-end">
                <a target="_blank" href="https://rb.gy/le029" rel="noreferrer">
                  <button className="signup-btn">Book Demo</button>
                </a>
              </div>
            )}
          </>
        )}
      </div>

      <hr className="hr-for-header" />
    </section>
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setErrorMessage("Please enter your email address");
    } else {
      try {
        let obj = { email: email };
        await post("/auth/subscribe", obj);
        setEmail("");
        handleThankYouScreen();
      } catch (error) {
        setErrorMessage(error.data.detail);
      }
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setErrorMessage("");
  };

  return (
    <div className="getstart-container">
      <Link to="/homes" className="mx-2">
        <img src={Logo} alt="vacay" className="logo" />
      </Link>
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
  );
};

const Banner = ({ isMobile, onGetStartedClick, personal, setPersonal }) => {
  return (
    <div className="container banner-content">
      <div className="btns">
        <Button
          style={{ background: personal === false ? "#F4F7FE" : "transparent" }}
          onClick={() => setPersonal(false)}
        >
          <img
            src={personalimg}
            style={{ marginBottom: "4px", marginRight: "15px" }}
            alt="personal"
          />
          <strong style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Personal</strong>
        </Button>
        <Button
          style={{ background: personal === true ? "#F4F7FE" : "transparent" }}
          onClick={() => setPersonal(true)}
        >
          <img
            src={businessImg}
            style={{ marginBottom: "4px", marginRight: "15px" }}
            alt="business"
          />{" "}
          <strong style={{ fontFamily: 'Poppins', fontWeight: 700 }}>Business</strong>
        </Button>
      </div>
      <div className="row">
        <div className="col-md-6">
          <h1 className="main-heading">
            {personal === true
              ? " Unlock the full potential of your workforce data"
              : " Make booking time off a task to look forward to"}
          </h1>
          <p className="sub-heading">
            {personal === true
              ? "Tap into $2,600* potential savings per employee by effectively managing paid time off (PTO) liability. Rely on data analysis to improve retention and well-being."
              : "Optimize your time off using our user-friendly interface and forward-looking balances. Sync with friends to plan the perfectvacation together."}
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
                {personal === true ? (
                  <a target="_blank" href="https://rb.gy/le029" rel="noreferrer">
                    <button className="signup-btn">Book Demo &gt;</button>
                  </a>
                ) : (
                  <Link to="/register">
                    <button className="signup-btn">Get Started &gt;</button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="col-md-5 col-12 ">
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
    </div>
  );
};

const Planner = ({ isMobile, onGetStartedClick, personal }) => {
  return (
    <div>
      <div className="planner-heading">
        {personal === true ? (
          <p>
            <span className="planner-heading-color"> Your ideal </span>
            HR analytics
            <span className="planner-heading-color"> partner </span>
          </p>
        ) : (
          <p>
            Your{" "}
            <span className="planner-heading-color">personal time off</span>{" "}
            planner
          </p>
        )}
      </div>
      <div className="container">
        <div className="row my-5 planner-boxes justify-content-center">
          <div className="col-md-4 ">
            <div className={personal == true ? 'screens sc-1-business' : 'screens sc-1-personal'}>
              <h4 className="box-heading">
                {personal === true
                  ? "Easy and secured setup"
                  : "Easily book and store your days off "}
              </h4>
              <h5 className="box-sub-heading">
                {personal === true
                  ? "Vacay seamlessly integrates with your current HR information systems, guaranteeing the utmost security for your sensitive data"
                  : " Book your PTO with just a few clicks and store all your booking in one place"}
              </h5>
              <br></br>
              {personal === true ? (
                <img
                  src={pic1}
                  className="planner-img"
                  style={{
                    left: "0px",
                    paddingTop: "60px",
                    paddingBottom: "10px"
                  }}
                  alt="pic1"
                />
              ) : (
                <img src={Calendar1} className="planner-img" alt="calender1" />
              )}
              <br />
              <br />
              {personal === false && (
                <img src={Cal02} className="planner-img" alt="calender2" />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div
              className={personal == true ? 'screens sc-2-business' : 'screens sc-2-personal'}
              style={{ height: personal === true ? "auto" : "inherit" }}
            >
              <h4 className="box-heading">
                {personal === true
                  ? "Powerful people management analytics"
                  : "  Visualize and forecast your PTO"}
              </h4>
              <h5 className="box-sub-heading">
                {personal === true
                  ? "Leverage data analytics to identify direct cost reductions linked to PTO liability and predict resignations within your workforce."
                  : "  See how much time off you have left and plan your next vacation with ease."}
              </h5>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              {!personal === true && <div>
                <br></br>
                <br></br>
              </div>}

              {personal === true ? (
                <img
                  src={pic2}
                  className="planner-img"
                  style={{ left: "0px" }}
                  alt="pic2"
                />
              ) : (
                <img src={Calender3} className="planner-img" alt="calender1" />
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className={personal == true ? 'screens sc-3-business' : 'screens sc-3-personal'}>
              <h4 className="box-heading">
                {personal === true
                  ? "Actionable and tailored recommendations"
                  : "  Plan with friends & family, seamlessly"}
              </h4>
              <h5 className={`box-sub-heading  ${personal === true && 'pb-3'}`}>
                {personal === true
                  ? "Rely on analytics to implement action plans at employee level to improve retention and promote well-being proactively."
                  : " Plan trips together based on availability and easily sync calendars."}


              </h5>
              {personal === true ? (
                <img
                  src={pic3}
                  className="planner-img"
                  style={{
                    left: "0px",
                    paddingTop: "50px",
                    paddingBottom: "70px",
                  }}
                  alt="pic3"
                />
              ) : (
                <img
                  src={SmallEarnings}
                  className="planner-sc3-image"
                  alt="calender1"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="signup-btn-container">
        {isMobile ? (
          <button className="signup-btn" onClick={onGetStartedClick}>
            Sign Up
          </button>
        ) : (
          <>
            {personal === true ? (
              <a target="_blank" href="https://rb.gy/le029" rel="noreferrer">
                <button className="signup-btn">Book Demo</button>
              </a>
            ) : (
              <Link to="/register">
                <button className="signup-btn">Sign Up</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Footer = ({ personal }) => {
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
        await post("/auth/subscribe", obj);
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
  const blogStyle = {
    cursor: "pointer",
    color: "white",
    marginTop: "11px",
    fontFamily: "Poppins",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "20px",
  };
  return (
    <div className="footer-container">
      {personal === true ? (
        <p className="coverage-text">
          *On average, firms with more than 500 workers owe each employee $2,609
          in accrued paid time off - <a style={{ color: "white"}} target="_blank" href="https://www.wsj.com/articles/BL-ATWORKB-2313">Source</a> .
        </p>
      ) : (
        ""
      )
      }
      <hr className="hr-for-header" />

      <Link to="/homes" className="mx-2">
        <img src={Logo} alt="vacay" className="logo" />
      </Link>

      <div className="footer-section">
        <Container>
          <Row>
            <Col >
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
            </Col>
            <Col  className="text-end">
              <p style={blogStyle} onClick={goToBlog}>
                Blog
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div >
  );
};

const goToBlog = () => {
  window.open(
    "https://vacay-live.notion.site/Vacay-Blog-8bb71268be634ef2a029403032371605"
  );
};

const Landing = () => {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [personal, setPersonal] = useState(true);
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
                personal={personal}
                isMobile={isMobile}
                onGetStartedClick={handleGetStartedClick}
              />
              <Banner
                personal={personal}
                setPersonal={setPersonal}
                isMobile={isMobile}
                onGetStartedClick={handleGetStartedClick}
              />
              <Planner
                personal={personal}
                isMobile={isMobile}
                onGetStartedClick={handleGetStartedClick}
              />
              <Footer personal={personal} />
            </>
          )}
          {showGetStarted && <GetStarted />}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Landing;
