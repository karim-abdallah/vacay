import React from 'react'
import hrlogo from '../../assets/images/hrlogo.svg'
import FormControl from 'react-bootstrap/FormControl'
import "./login.css"
import { Link, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Image from 'react-bootstrap/Image'

export default function Forget() {
    const navigate =useNavigate();
    const handleNavigate=()=>{
        navigate('/')
      }
  
    return (
        <div className="mainContainer">

            <div className="main pt-5">
                <div className="d-flex justify-content-center flex-column align-items-center">
                    {/* <div className="logo">
                        Jarvis <span className="ex">HR</span>
                    </div> */}
                    <Image src={hrlogo} alt="Logo" className='w-50' onClick={handleNavigate} />
                    <div className="txt mt-4">Forgot Your Password?</div>
                    <div className="link mt-2">
                        <p className='li'> Enter your email address and we will send you instructions to reset your password
                        </p>
                    </div>
                </div>
                <div className="inputs d-flex flex-column m-4">
                    <div className="email">
                        <FormControl placeholder='Email address' aria-label="Large" size="lg"
                            aria-describedby="inputGroup-sizing-sm"></FormControl>
                    </div>


                </div>

                <div className="btns m-4">
                    <Link to='/home' className='li text-decoration-none'> <Button variant="none" size="lg" className='btn'>Continue  </Button></Link>
                </div>
                <div className="back">
                    <div className="link mt-4">
                        <Link to="/login" className='li text-decoration-none'>Back to JarvisHR</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
