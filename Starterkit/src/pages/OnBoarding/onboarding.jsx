import React from "react";
import Logo from "../../assets/images/Subtract.svg";
import { useState, useEffect } from "react";
import { Card, CardBody, Input, CardImg } from "reactstrap";
import Calendar1 from "../../assets/images/calendar_vac2.svg";
import Cal02 from "../../assets/images/cal03.svg";
import Calender3 from "../../assets/images/calender31.svg";
import SmallEarnings from "../../assets/images/Small_Earnings1.svg";

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
const TimeOffPolicy = ({ moveToNextStep, setTimeOffPolicy}) => {
  const [policyType, setPolicyType] = useState("Accrual");
  
  const handleAccrual = () => {
    setPolicyType("Accrual");
    setTimeOffPolicy("Accrual");
  };
  const handleUnlimited = () => {
    setPolicyType("Unlimited");
    setTimeOffPolicy("Unlimited");
  };
  const getBorderStyle = (cardType) => {
    
    if (cardType === policyType) {
      return { border: "1px solid #384077",cursor: "pointer" };
    } else {
      return {cursor: "pointer"};
    }
  };
  return (
    <div>
      <h1 className="onboarding-heading">Choose your time off policy</h1>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-sm-4" style={{ padding: "20px" }}>
            <Card onClick={handleAccrual} style={getBorderStyle("Accrual")}>
              <CardBody>
                <h5 className="onboarding-card-title">Accrual</h5>
                <p className="onboarding-card-text">
                  Accrual Where you earn a certain number of days off each
                  month.
                  <br />
                  <br />
                  Example: you earn 1.5 days at the end of each month.
                </p>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-4" style={{ padding: "25px" }}>
            <Card onClick={handleUnlimited} style={getBorderStyle("Unlimited")}>
              <CardBody>
                <h5 className="onboarding-card-title">Unlimited</h5>
                <p className="onboarding-card-text">
                  Where there is no specific time off limit.
                  <br />
                  <br />
                  Example: you are self-employed and don’t have any time off
                  constraints.
                </p>
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
const TimeOffFigure = ({ moveToNextStep }) => {
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
      <h5>
        You can change your time off settings at anytime through the top menu.
      </h5>
      <div className="container">
        <div className="row">
          <div className="col-sm-4" style={{ padding: "20px" }}>
            <Card className="ml-4 text-center">
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
                    id="exampleNumber"
                    placeholder="15 days"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-4" style={{ padding: "20px" }}>
            <Card>
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
                    id="exampleNumber"
                    placeholder="24 days"
                  />
                </div>
              </CardBody>
            </Card>
          </div>
          <div className="col-sm-4" style={{ padding: "25px" }}>
            <Card>
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
                    id="exampleNumber"
                    placeholder="7 days"
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
const CountryOfResidence = ({ moveToNextStep }) => {
  return (
    <div>
      <h1 className="onboarding-heading">Select your country of residence</h1>
      <h5>
        We will pre-populate public holidays for you, you can later add or
        remove dates.
      </h5>
      <div className="container">
        <div className="row mt-5">
          <div className="col-md-4 offset-md-4">
            <Card className="ml-4">
              <CardBody className="p-3 pb-2">
                <h5 className="onboarding-card-title">Unites States</h5>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <Card className="ml-4">
              <CardBody className="p-3 pb-2">
                <h5 className="onboarding-card-title">France</h5>
              </CardBody>
            </Card>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <Card className="ml-4">
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
const Invitation = ({ moveToNextStep }) => {
  return (
    <div>
      <h1 className="onboarding-heading">
        Invite your friends and family members
      </h1>
      <h5>To sync your calendars and plan vacations together.</h5>
      <div className="textarea-container">
        <Input
          type="textarea"
          name="text"
          id="exampleText"
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
      <h5>
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
                <CardImg
                  top
                  width="100%"
                  src={Calendar1}
                  alt="Card image cap"
                />
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
      <button className="onboarding-button">Open Vacay</button>
    </div>
  );
};
const Dots = ({ currentStep,timeOffPolicy }) => {
  const dots = [1, 2, 3, 4, 5];
  // if (timeOffPolicy === "Unlimited") {
  //   dots.splice(2, 1);
  // }
  return (
    <>
      {currentStep == 0 ? (
        ""
      ) : (
        <div className="dots-container">
          {dots.map((dot) => (
            <div
              className={`dot-${dot === currentStep ? "active" : "inactive"}`}
              key={dot}
            ></div>
          ))}
        </div>
      )}
    </>
  );
};
const OnBoarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [timeOffPolicy, setTimeOffPolicy] = useState("Accrual");
  const handleTimeOffPolicy = (policyType) => {
    setTimeOffPolicy(policyType);
  };
  const steps = [
    <VaccyOnBoarding moveToNextStep={() => setCurrentStep(1)} />,
    <TimeOffPolicy moveToNextStep={() => setCurrentStep(2)} setTimeOffPolicy={handleTimeOffPolicy} />,
    <TimeOffFigure moveToNextStep={() => setCurrentStep(3)} />,
    <CountryOfResidence moveToNextStep={() => setCurrentStep(4)} />,
    <Invitation moveToNextStep={() => setCurrentStep(5)} />,
    <StartBooking />,
  ];
  // console.log(steps);
  // if (timeOffPolicy === "Unlimited") {
  //   steps.splice(2, 1);
  // }
  // else {
  //   steps.splice(2, 0, <TimeOffFigure moveToNextStep={() => setCurrentStep(3)} />);
  // }
  return (
    <div className="onboarding-container">
      <div className="text-center">{steps[currentStep]}</div>
      <Dots currentStep={currentStep} timeOffPolicy={timeOffPolicy}/>
    </div>
  );
};

export default OnBoarding;
