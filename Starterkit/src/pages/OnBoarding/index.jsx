import React from "react";
import Logo from "../../assets/images/Subtract.svg";
import { useState, useEffect } from "react";
import { Card, CardBody, Input, CardImg } from "reactstrap";
import Calendar1 from "../../assets/images/calendar_vac2.svg";
import Cal02 from "../../assets/images/cal03.svg";
import Calender3 from "../../assets/images/calender31.svg";
import SmallEarnings from "../../assets/images/Small_Earnings1.svg";
import { Link } from "react-router-dom";
import { put } from "../../helpers/api_helper";

function OnboardingCard({ onClick, className, title, text }) {
  return (
    <div style={{ padding: "20px" }}>
      <Card onClick={onClick} className={className}>
        <CardBody>
          <h5 className="onboarding-card-title">{title}</h5>
          <p className="onboarding-card-text">{text}</p>
        </CardBody>
      </Card>
    </div>
  );
}
const VaccyOnBoarding = ({ moveToNextStep }) => {
  return (
    <div>
      <img src={Logo} alt="logo" className="Subtract-logo" />
      <h1 className="onboarding-heading">Welcome to Vacay</h1>
      <h5>Vacay helps you optimize your time off and vacation planning.</h5>
      <br />
      <br />
      <button className="onboarding-button" onClick={moveToNextStep}>
        Get Started
      </button>
    </div>
  );
};
const TimeOffPolicy = ({ moveToNextStep, setTimeOffPolicy, timeOffPolicy }) => {
  const [policyType, setPolicyType] = useState(timeOffPolicy || "accrual");

  useEffect(() => {
    if (timeOffPolicy) {
      setPolicyType(timeOffPolicy);
    }
  }, [timeOffPolicy]);

  const handleCardClick = (policyType) => {
    setPolicyType(policyType);
    setTimeOffPolicy(policyType);
  };

  const getBorderStyle = (cardType) => {
    if (cardType === policyType) {
      return "card-active";
    } else {
      return "card-inactive";
    }
  };
  return (
    <div>
      <h1 className="onboarding-heading">Choose your time off policy</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-4" style={{ padding: "10px" }}>
            <OnboardingCard
              onClick={() => handleCardClick("accrual")}
              className={getBorderStyle("accrual")}
              title="Accrual"
              text={
                <>
                  Where you earn a certain number of days off each month.
                  <br />
                  <br /> Example: you earn 1.5 days at the end of each month.
                </>
              }
            />
          </div>
          <div className="col-sm-4" style={{ padding: "10px" }}>
            <OnboardingCard
              onClick={() => handleCardClick("unlimited")}
              className={getBorderStyle("unlimited")}
              title="Unlimited"
              text={
                <>
                  Where there is no specific time off limit.
                  <br />
                  <br />
                  Example: you are self-employed and don’t have any time off
                  constraints.
                </>
              }
            />
          </div>
        </div>
      </div>
      <button className="onboarding-button" onClick={moveToNextStep}>
        Continue
      </button>
    </div>
  );
};
const TimeOffFigure = ({
  timeOffFigure,
  moveToNextStep,
  onTimeOffFigureChange,
}) => {
  const { annualAllowance, annualCap, currentBalance } = timeOffFigure;

  const handleAnnualAllowanceChange = (e) => {
    const newAnnualAllowance = parseInt(e.target.value);
    onTimeOffFigureChange({ annualAllowance: newAnnualAllowance });
  };
  const handleAnnualCapChange = (e) => {
    const newAnnualCap = parseInt(e.target.value);
    onTimeOffFigureChange({ annualCap: newAnnualCap });
  };
  const handleCurrentBalanceChange = (e) => {
    const newCurrentBalance = parseInt(e.target.value);
    onTimeOffFigureChange({ currentBalance: newCurrentBalance });
  };

  const timeOffFigureStyle = {
    "card-input": {
      width: "50%",
      textAlign: "center",
      background: "#F4F7FE",
      border: "none !important",
    },
    "center-content": {
      display: "flex",
      justifyContent: "center",
    },
  };
  return (
    <div>
      <h1 className="onboarding-heading">Input your time off figures</h1>
      <h5 className="onboarding-subheading">
        You can change your time off settings at anytime through the top menu.
      </h5>
      <div className="container">
        <div className="row">
          <div className="col-sm-4" style={{ padding: "20px" }}>
            <Card className="ml-4 text-center onboarding-cards">
              <CardBody>
                <h5 className="onboarding-card-title">Annual Allowance</h5>
                <p className="onboarding-card-text">
                  Indicate the number of days off you are entitled to each year:
                </p>
                <div style={timeOffFigureStyle["center-content"]}>
                  <Input
                    style={timeOffFigureStyle["card-input"]}
                    type="number"
                    name="number"
                    id="annualAllowance"
                    placeholder={`${annualAllowance} days`}
                    onChange={handleAnnualAllowanceChange}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-4" style={{ padding: "20px" }}>
            <Card className="onboarding-cards">
              <CardBody>
                <h5 className="onboarding-card-title">Annual Cap</h5>
                <p className="onboarding-card-text">
                  Specify the maximum number of days you can accumulate over a
                  year:
                </p>
                <div style={timeOffFigureStyle["center-content"]}>
                  <Input
                    style={timeOffFigureStyle["card-input"]}
                    type="number"
                    name="number"
                    id="annualCap"
                    placeholder={`${annualCap} days`}
                    onChange={handleAnnualCapChange}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-4" style={{ padding: "25px" }}>
            <Card className="onboarding-cards">
              <CardBody>
                <h5 className="onboarding-card-title">Current Balance</h5>
                <p className="onboarding-card-text">
                  Input the number of days you already accrued as of now:
                </p>
                <div style={timeOffFigureStyle["center-content"]}>
                  <Input
                    style={timeOffFigureStyle["card-input"]}
                    type="number"
                    name="number"
                    id="currentBalance"
                    placeholder={`${currentBalance} days`}
                    onChange={handleCurrentBalanceChange}
                  />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <button className="onboarding-button" onClick={moveToNextStep}>
        Continue
      </button>
    </div>
  );
};
const CountryOfResidence = ({
  moveToNextStep,
  countryOffResidence,
  setCountryOffResidence,
}) => {
  const [country, setCountry] = useState(countryOffResidence || "United States");

  useEffect(() => {
    if (countryOffResidence) {
      setCountry(countryOffResidence);
    }
  }, [countryOffResidence]);
  const handleCountryOfResidenceChange = (country) => {
    setCountry(country);
    setCountryOffResidence(country);
  };

  const getBorderStyle = (cardType) => {
    if (cardType === country) {
      return "card-active";
    } else {
      return "card-inactive";
    }
  };
  return (
    <div>
      <h1 className="onboarding-heading">Select your country of residence</h1>
      <h5 className="onboarding-subheading">
        We will pre-populate public holidays for you, you can later add or
        remove dates.
      </h5>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-4 offset-md-4">
            <Card
              className={"ml-4 " + getBorderStyle("United States")}
              onClick={() => handleCountryOfResidenceChange("United States")}
            >
              <CardBody className="p-3 pb-2">
                <h5 className="onboarding-card-title">Unites States</h5>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <Card
              className={"ml-4 " + getBorderStyle("France")}
              onClick={() => handleCountryOfResidenceChange("France")}
            >
              <CardBody className="p-3 pb-2">
                <h5 className="onboarding-card-title">France</h5>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <Card
              className={"ml-4 " + getBorderStyle("Other")}
              onClick={() => handleCountryOfResidenceChange("Other")}
            >
              <CardBody className="p-3 pb-2">
                <h5 className="onboarding-card-title">Other</h5>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
      <br />
      <button className="onboarding-button" onClick={moveToNextStep}>
        Continue
      </button>
    </div>
  );
};
const Invitation = ({ moveToNextStep, invitation, setInvitation }) => {
  const [email, setEmail] = useState(invitation || "");

  useEffect(() => {
    if (invitation) {
      setEmail(invitation);
    }
  }, [invitation]);
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setInvitation(e.target.value);
  };
  return (
    <div>
      <h1 className="onboarding-heading">
        Invite your friends and family members
      </h1>
      <h5 className="onboarding-subheading">
        To sync your calendars and plan vacations together.
      </h5>
      <div className="textarea-container">
        <Input
          value={email}
          onChange={handleEmail}
          type="textarea"
          name="text"
          id="email"
          className="onboarding-textarea"
          placeholder="email@example.com, email2@example.com.."
        />
      </div>
      <div>
        <button
          className="onboarding-send-invites onboarding-button"
          onClick={moveToNextStep}
        >
          Send invites
        </button>
      </div>
      <button className="onboarding-button" onClick={moveToNextStep}>
        Continue
      </button>
    </div>
  );
};
const StartBooking = () => {
  return (
    <div>
      <h1 className="onboarding-heading">You're good to go!</h1>
      <h5 className="onboarding-subheading">
        Next, start booking time-off in your calendar and enjoy our features:
      </h5>
      <div className="container">
        <div className="row justify-content-around">
          <div className="col-sm-3" style={{ padding: "20px" }}>
            <Card className="card-bg-col">
              <CardBody>
                <h5 className="onboarding-card-title">
                  Easily book and store your days off
                </h5>
                <br />
                <CardImg
                  top
                  width="100%"
                  src={Calendar1}
                  alt="Card image cap"
                />
                <br />
                <CardImg top width="100%" src={Cal02} alt="Card image cap" />
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-3" style={{ padding: "20px" }}>
            <Card className="card-bg-col">
              <CardBody>
                <h5 className="onboarding-card-title">
                  Visualize and forecast your PTO
                </h5>
                <br />
                <CardImg
                  top
                  width="100%"
                  src={Calender3}
                  alt="Card image cap"
                />
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-3" style={{ padding: "25px" }}>
            <Card className="card-bg-col">
              <CardBody>
                <h5 className="onboarding-card-title">
                  Plan with friends & family, seamlessly
                </h5>
                <br />
                <CardImg
                  top
                  width="100%"
                  src={SmallEarnings}
                  alt="Card image cap"
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
const Dots = ({ currentStep, setCurrentStep, dots }) => {
  const handleDotsClick = (step) => {
    setCurrentStep(step);
  };
  return (
    <>
      {currentStep === 0 ? (
        ""
      ) : (
        <div className="dots-container">
          {dots.map((dot) => (
            <div
              className={`dot-${dot === currentStep ? "active" : "inactive"}`}
              key={dot}
              onClick={() => handleDotsClick(dot)}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};
const OnBoarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeOffPolicy, setTimeOffPolicy] = useState("accrual");
  const [timeOffFigure, setTimeOffFigure] = useState({
    annualAllowance: 15,
    annualCap: 24,
    currentBalance: 7,
  });
  const [countryOffResidence, setCountryOffResidence] = useState("United States");
  const [invitation, setInvitation] = useState("");

  const handleTimeOffFigureChange = (newTimeOffFigure) => {
    setTimeOffFigure((prevTimeOffFigure) => ({
      ...prevTimeOffFigure,
      ...newTimeOffFigure,
    }));
  };


  const OpenVacay = async () => {
    let obj = {
      time_off_type: "pto",
      accrual_type: timeOffPolicy,
      annual_allowance_days: timeOffFigure.annualAllowance,
      accrual_cap_days: timeOffFigure.annualCap,
      current_balance_days: timeOffFigure.currentBalance,
      country: countryOffResidence,
    };
    await put("/dashboard/time-off-settings", obj);
  }

  const dots = timeOffPolicy === "unlimited" ? [1, 3, 4, 5] : [1, 2, 3, 4, 5];
  const steps = [
    <VaccyOnBoarding moveToNextStep={() => setCurrentStep(1)} />,
    timeOffPolicy !== "unlimited" ? (
      <TimeOffPolicy
        moveToNextStep={() => setCurrentStep(2)}
        setTimeOffPolicy={setTimeOffPolicy}
        timeOffPolicy={timeOffPolicy}
      />
    ) : (
      <TimeOffPolicy
        moveToNextStep={() => setCurrentStep(3)}
        setTimeOffPolicy={setTimeOffPolicy}
        timeOffPolicy={timeOffPolicy}
      />
    ),
    <TimeOffFigure
      moveToNextStep={() => setCurrentStep(3)}
      timeOffFigure={timeOffFigure}
      onTimeOffFigureChange={handleTimeOffFigureChange}
    />,
    <CountryOfResidence
      moveToNextStep={() => setCurrentStep(4)}
      countryOffResidence={countryOffResidence}
      setCountryOffResidence={setCountryOffResidence}
    />,
    <Invitation
      moveToNextStep={() => setCurrentStep(5)}
      invitation={invitation}
      setInvitation={setInvitation}
    />,
    <StartBooking />,
  ].filter(Boolean); //filter boolean removes the undefined values from the array

  return (
    <div className="onboarding-container">
      <div className="text-center">{steps[currentStep]}</div>
      {currentStep + 1 === steps.length ? (
        <div className="text-center">
          <Link to="/dashboard">
            <button className="onboarding-button" onClick={OpenVacay}>Open Vacay</button>
          </Link>
        </div>
      ) : (
        console.log(currentStep + 1, steps.length)
      )}
      <Dots
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        dots={dots}
      />
    </div>
  );
};

export default OnBoarding;
