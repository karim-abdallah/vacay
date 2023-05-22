import React, { useState, useEffect } from "react";

import { Container, Card, CardBody } from "reactstrap";
import Background from "../../assets/images/Background_Image.svg";
import Picture from "../../assets/images/profile.png";
import { get, post, s3Post } from "../../helpers/api_helper";
import editIcon from "../../assets/images/edit-icon.svg";


const Banner = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    setIsUploading(true);
    uploadToS3(selectedFile);
  };

  const uploadToS3 = async (selectedFile) => {
    let obj = {
      file_name: selectedFile.name,
      file_type: selectedFile.type,
    };

    try {
      let response = await post("/dashboard/generate-presigned-url", obj);

      try {
        await s3Post(response.detail, selectedFile);
        await post("/dashboard/update-profile-picture", obj);
        props.fetchData();
        setIsUploading(false);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      setError(error.data.detail);
    }
  };

  useEffect(() => {
    setImageUrl(props.profilePic);
  }, [props]);

  return (
    <div>
      <img className="banner-image" src={Background} alt="Banner" />
      <div className="profile-image-container">
        {error ? error : null}

        <div className="image-upload">
          <label htmlFor="file-input" className="image-label">
            <img
              className="profile-image"
              src={imageUrl ? imageUrl : Picture}
              alt="Profile"
            />
            <img className="edit-icon" src={editIcon} alt="Profile" />
          </label>
          <input
            id="file-input"
            type="file"
            onChange={handleFileSelect}
            disabled={isUploading}
          />
          {isUploading && <div className="loading-spinner">Loading...</div>}
        </div>
      </div>
    </div>
  );
};

const ChangePassword = ({ toggleComponent }) => {
  const strongRegex = new RegExp(
    "^.{8,20}$"
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypeNewPassword, setRetypeNewPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState(true);
  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (newPassword !== retypeNewPassword) {
      setError("Passwords do not match");
    } else {
      if (analyze()) {
        changePassword();
      }
    }
  };

  const changePassword = async () => {

    let obj = {
      old_password: currentPassword,
      new_password: newPassword,
    };

    try {
      let data = await post("/auth/change-password", obj);
      setError(data.detail);
    } catch (error) {
      setError(error.data.detail);
    }
  }
  const analyze = () => {
    console.log(strongRegex,newPassword)
    console.log(strongRegex.test(newPassword));
    if (strongRegex.test(newPassword)) {
      return true;
    } else {
      setError("Password Validation Not Met");
      return false;
    }
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
    if (newPassword.length >= 8 && newPassword.length <= 20) {
      setPasswordValidation(false);
      setError("");
    }
    else {
      setPasswordValidation(true);
    }
  };

  const handleRetypeNewPasswordChange = (event) => {
    setError("");
    setRetypeNewPassword(event.target.value);
  };

  return (
    <div>
      <a className="toggle" onClick={toggleComponent} href="#">
        Back
      </a>
      <div className="change-password-content">
        <h2>Change Password</h2>
      </div>
      <div className="change-password-content">
        <form onSubmit={handleFormSubmit} className="input-forms">
          {error ? error : null}
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
              {!passwordValidation ? (
                <li
                  style={{ listStyleType: "none", fontSize: "12px" }}
                >
                  Password should be between 8 and 20 characters
                </li>
              ) : <li style={{
                color: "red",
                listStyleType: "none",
                fontSize: "12px",
              }} >
                Password should be between 8 and 20 characters
              </li>}

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
          <div className="pwd-chng-btn">
            <button className="save-profile" type="Submit" disabled={passwordValidation}>
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
  const [proflePic, setProfilePic] = useState();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleFormSubmit = (event) => {
    let obj = {
      first_name: firstName,
      last_name: lastName,
    };

    event.preventDefault();

    updateProfile(obj);
  };

  const updateProfile = async (obj) => {
    try {
      let data = await post("/dashboard/update-user", obj);
      setError(data.detail);
    } catch (error) {
      setError(error.data.detail);
    }
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const fetchData = async () => {
    let data = await get("/dashboard/user");
    setUserName(data["username"]);
    setEmail(data["email"]);
    setFirstName(data["first_name"]);
    setLastName(data["last_name"]);
    setProfilePic(data["profile_pic"]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>

      <h2>General Information</h2>

      <Banner profilePic={proflePic} fetchData={fetchData} />

      {error ? error : null}
      <br />
      <br />
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

              <div className="form-group  mt-3">
                <label htmlFor="userName">User Name</label>
                <input
                  type="text"
                  id="userName"
                  className="form-control"
                  value={userName}
                  disabled
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  className="form-control"
                  value={lastName}
                  onChange={handleLastNameChange}
                />
              </div>
              <div className="form-group mt-3">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  value={email}
                  disabled
                />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <a className="toggle" onClick={toggleComponent} href="#">
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
