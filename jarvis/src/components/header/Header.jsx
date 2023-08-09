import React from 'react'
import "./header.css"
import logout from '../../assets/images/logout.png'
import feedback from '../../assets/images/feedback.svg'
import hrlogo from '../../assets/images/hrlogo.svg'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'

export default function Header() {
  const local=localStorage.getItem('isLoggedIn')
  const tooltip = (
    <Tooltip id="tooltip">
      Help
    </Tooltip>
  );
  const tooltip1 = (
    <Tooltip id="tooltip">
      Logout
    </Tooltip>
  );

  const navigate = useNavigate();
  const handleNavigate = () => {
  local?navigate('/home'):navigate('/login')
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }
  const goToFeedback = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSewOeenbHvlcb2GK1uOXSvZ05iW8EATairwJbXPNHIk4lzDow/viewform"
    );
  };
  return (

    <div className="d-flex justify-content-between mb-3">

      <Image src={hrlogo} alt="Logo" className='hrlogo' onClick={handleNavigate} />

      <div className="icon mt-3" >
        <OverlayTrigger placement="bottom" overlay={tooltip}>
          <FeedBackButton onClick={goToFeedback}>
            <FeedBackButtonIcon src={feedback} />
          </FeedBackButton>

        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={tooltip1}>

          <LogOutButton onClick={handleLogout}>
            <LogoutIcon src={logout} />
          </LogOutButton>

        </OverlayTrigger>

      </div>

    </div>

  )
}
const LogoutIcon = styled.img`
  height: 17px;
`;

const LogOutButton = styled.button`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align:center;
  height: 40px;
  width: 40px;
  border-width: 0px;
  border-radius: 13px;
  margin-left:10px;
  &:hover {
    background-color: rgb(255, 255, 255, 0.3);
  }
`;

const FeedBackButtonIcon = styled.img`
  height: 18px;
`;

const FeedBackButton = styled.button`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  height: 40px;
  width: 40px;
  text-align: center;
  border-width: 0px;
  border-radius: 13px;
  &:hover {
    background-color:rgb(255, 255, 255, 0.3);
  }
`;
