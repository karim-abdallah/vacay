import React from "react";
import { Container } from "reactstrap";
import Logo from "../../assets/images/logo-vaccay.png";
import SideImg2 from "../../assets/images/side-img2.png";
import Calendar1 from "../../assets/images/calendar_vac1.png";
import Cal02 from "../../assets/images/cal02.png";
import Calender3 from "../../assets/images/calender3.png";
import SmallEarnings from "../../assets/images/Small_Earnings.png";
import { useState, useEffect } from "react";


const Header = ({ onGetStartedClick }) => {
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-8">
          <img src={Logo} alt="vacay" />
        </div>
        {isMobile ? (
          <div className="col-3">
            <button className="signup-btn" onClick={onGetStartedClick}>
              Get Started
            </button>
          </div>
        ) : (
          <>
            <div className="col-1">
              <button className="login-btn">Log in</button>
            </div>
            <div className="col-2">
              <button className="signup-btn">Sign Up</button>
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
  const handleRemindMeScreen = () => {
    setRemindMe(false);
  };

  const handleThankYouScreen = () => {
    setSubmit(true);
  };

  const handleFormSubmit = (event) => {
    handleThankYouScreen();
    event.preventDefault();
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div className="getstart-container">
      <img src={Logo} alt="vacay" />
      <hr className="hr-for-header" />

      {isSubmit ? (
        <div className="thank-screen">
          <p className="getstart-heading">
            Thank you for subscribing and stay tuned for updates!
          </p>
        </div>
      ) : isRemindMe ? (
        <>
          <p className="getstart-heading">
            We’re desktop-only for now, but we've got your back! Click to get a
            reminder and come back later.
          </p>
          <div className="getstart-btn">
            <button className="signup-btn" onClick={handleRemindMeScreen}>
              Remind Me
            </button>
          </div>
        </>
      ) : (
        <>
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
              {/* <button className="signup-btn" type="Submit"onClick={handleThankYouScreen}> */}
              <button className="signup-btn" type="Submit">
                Submit
              </button>
            </div>
          </form>
        </>
      )}
      <div className="col-6 side-img-container2">
        <img src={SideImg2} alt="side-img" className="side-img" />
      </div>
    </div>
  );
};

const Banner = () => {
  
  return (
    <div className="container banner-content">
      <div className="row ">
        <div className="col-6 headings-container">
          <h1 className="main-heading">
            Make booking time off a task to look forward to
          </h1>
          <p className="sub-heading">
            Optimize your time off using our user-friendly interface and
            forward-looking balances. Sync with friends to plan the perfect
            vacation together.
          </p>
          <div className="get-start-btn">
            <button className="signup-btn">Get Started &gt;</button>
          </div>
        </div>
        <div className="col-6 side-img-container">
          <img src={SideImg2} alt="side-img" className="side-img" />
        </div>
      </div>
    </div>
  );
};

const Planner = () => {
  return (
    <div>
      <div className="planner-heading">
        <p>Your personal time off planner</p>
      </div>
      <div className="planner-content">
        <div className="row planner-content-row">
          <div className="col-4 screens sc-1">
            <h4 className="planner-sc-heading">
              Easily book and store your days off
            </h4>
            <h5>
              Book your PTO with just a few clicks and store all your bookings
              in one place.
            </h5>
            <br></br>
            <img src={Calendar1} className="planner-img" alt="calender1" />
            <img src={Cal02} className="planner-img" alt="calender2" />
          </div>
          <div className="col-4 screens sc-2">
            <h4 className="planner-sc-heading">
              Visualize and forecast your PTO
            </h4>
            <h5>
              See how much time off you have left and plan your next vacation
              with ease.
            </h5>
            <br></br>
            <br></br>
            <img src={Calender3} className="planner-img" alt="calender1" />
          </div>
          <div className="col-4 screens sc-3">
            <h4 className="planner-sc-heading">
              Plan with friends & family, seamlessly
            </h4>
            <h5>
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
        <div className="signup-btn-container">
          <button className="signup-btn">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
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
            
              <button className="footer-btn" type="Submit">Subscribe</button>
            
            </div>
        </form>
      </div>
    </div>
  );
};

const Landing = () => {
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [showContent, setShowContent] = useState(true);
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
              <Header onGetStartedClick={handleGetStartedClick} />
              <Banner />
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