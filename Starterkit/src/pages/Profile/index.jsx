import React, { useState } from "react";

import { Container, Card, CardBody } from "reactstrap";
import Background from "../../assets/images/Background_Image.png";
import Picture from "../../assets/images/profile_1.png";

const Banner = () => {
  return (
    <div>
      <img className="banner-image" src={Background} alt="Banner" />
      <div className="profile-image-container">
        <img className="profile-image" src={Picture} alt="Profile" />
      </div>
    </div>
  );
};

const ChangePassword = ({ toggleComponent }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
  };
  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };
  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };
  const handleRetypeNewPasswordChange = (event) => {
    setRetypeNewPassword(event.target.value);
  };

  return (
    <div>
      <a className="toggle" onClick={toggleComponent}>
        Back
      </a>
      <div className="change-password-content">
        <h2>Change Password</h2>
        </div>
      <div className="change-password-content">
        <form onSubmit={handleFormSubmit} className="input-forms">
          <div className="form-group input-group">
            <input
              placeholder="Current Password"
              type="password"
              id="currentPassword"
              className="form-control"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
          </div>

          <div className="form-group input-group">
            <input
              placeholder="New Password"
              type="password"
              id="newPassword"
              className="form-control"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>

          <div>
            <ul>
              <li>Minimum 8 character, maximum 20</li>
              <li>Must include upper and lower case letters</li>
              <li>
                Must include at least one number or one of the following
                character: !@#$%
              </li>
            </ul>
          </div>
          <div className="form-group input-group">
            <input
              placeholder="Retype New Password"
              type="password"
              id="retypeNewPassword"
              className="form-control"
              value={retypeNewPassword}
              onChange={handleRetypeNewPasswordChange}
            />
          </div>
          <div>
          <button className="save-profile" type="Submit">
            Save
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};
const GeneralInformation = ({ toggleComponent }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const handleFormSubmit = (event) => {
    event.preventDefault();
  };
  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };
  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  return (
    <div>
      <h2>General Information</h2>
      <Banner />

      <form onSubmit={handleFormSubmit}>
        <div className="container">
          <div className="row justify-content-center g-5 general-info">
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>

                <input
                  type="text"
                  id="firstName"
                  className="form-control"
                  value={firstName}
                  onChange={handleFirstNameChange}
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  id="userName"
                  className="form-control"
                  value={userName}
                  onChange={handleUserNameChange}
                />
              </div>

              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  value={email}
                  onChange={handleEmailChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <a className="toggle" onClick={toggleComponent}>
              Change Password
            </a>
          </div>
          <div className="row justify-content-center mt-3">
            <div className="col-md-6 text-center">
              <button className="save-profile" type="Submit">
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const Profile = () => {
  const [generalInfomation, setGeneralInfomation] = useState(true);
  const [changePassword, setChangePassword] = useState(false);

  const toggleComponent = () => {
    setGeneralInfomation(!generalInfomation);
    setChangePassword(!changePassword);
  };
  return (
    <React.Fragment>
      <div className="pagecontent">
        <Container>
          <Card className="custom-card">
            <CardBody className="px-5 py-4">
              {generalInfomation && (
                <GeneralInformation toggleComponent={toggleComponent} />
              )}
              {changePassword && (
                <ChangePassword toggleComponent={toggleComponent} />
              )}
            </CardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Profile;
