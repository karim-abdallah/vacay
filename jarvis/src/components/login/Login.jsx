import React, { useState } from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import "./login.css"
import { Link, useNavigate } from 'react-router-dom'
import { BsEye } from 'react-icons/bs'
import Button from 'react-bootstrap/Button'
import hrlogo from '../../assets/images/hrlogo.svg'
import Image  from 'react-bootstrap/Image'

export default function Login() {
    const navigate=useNavigate()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const session=sessionStorage.getItem('email')
    console.log(session)

    const handleContinue = (event) => {
        event.preventDefault();
        if(session)
        {
            navigate('/home');
        }
        else if(email==="" || password===""){
            alert("Enter email or password")
        }
        else{
            sessionStorage.setItem('email',email)
            setEmail('');
            setPassword('');
            navigate('/home');
            
        }
        console.log(email, password)
    }
    
    const handleNavigate=()=>{
        navigate('/')
      }
  
    return (
        <div className="mainContainer">

            <div className="main pt-5">
                <div className="d-flex justify-content-center flex-column align-items-center">
                    <Image src={hrlogo} alt="Logo" className='w-50' onClick={handleNavigate} />
                    <div className="txt mt-4">Welcome</div>
                    <div className="link mt-2">
                        <Link to="/login" className='li text-decoration-none'>Log in to Continue</Link>
                    </div>
                </div>
                <div className="inputs d-flex flex-column m-4">
                    <Form>
                        <div className="email">
                            <Form.Control
                                placeholder='Email address' aria-label="Large" size="lg"
                                type="email"
                                vale={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                aria-describedby="inputGroup-sizing-sm" />
                        </div>
                        <div className="password mt-3">
                            <InputGroup size="lg">
                                <Form.Control
                                    placeholder='Password' aria-label="Large"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    aria-describedby="inputGroup-sizing-sm"
                                    type="password" />
                                <InputGroup.Text id="inputGroup-sizing-lg">
                                    <BsEye />
                                </InputGroup.Text>
                            </InputGroup>
                        </div>
                    </Form>

                </div>
                <div className="forget ps-4">
                    <Link to="/forget" className='li  text-decoration-none'>Forgot Password?</Link>
                </div>
                <div className="btns m-4">
                    <Button variant="none" size="lg" className='btn' onClick={handleContinue}>Continue  </Button>
                </div>
            </div>
        </div>
    )
}
