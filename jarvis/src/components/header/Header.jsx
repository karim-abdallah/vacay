import React from 'react'
import "./header.css"
import logout from '../../assets/images/logout.svg'
import feedback from '../../assets/images/feedback.svg'
import hrlogo from '../../assets/images/hrlogo.svg'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'
import { useNavigate } from 'react-router-dom'

export default function Header() {
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

    const navigate =useNavigate();
    const handleNavigate=()=>{
      navigate('/')
    }

    const handleLogout=()=>{
      sessionStorage.removeItem('email')
      navigate('/')
    }
    const goToFeedback = () => {
      window.open(
        "https://docs.google.com/forms/d/e/1FAIpQLSewOeenbHvlcb2GK1uOXSvZ05iW8EATairwJbXPNHIk4lzDow/viewform"
      );
    };
  return (

    <div class="d-flex justify-content-between">

        <Image src={hrlogo} alt="Logo" className='hrlogo' onClick={handleNavigate}/>
     
      <div class="icon d-flex justify-content-center align-items-center" >
        <OverlayTrigger placement="bottom" overlay={tooltip}>
        
            <Image src={feedback} alt="Feddback" className='btnImg' onClick={goToFeedback}/>
          
        </OverlayTrigger>
        <OverlayTrigger placement="bottom" overlay={tooltip1}>
       
            <Image src={logout} alt="Logout" className='btnImg' onClick={handleLogout}/>
         
        </OverlayTrigger>

      </div>

    </div>

  )
}
