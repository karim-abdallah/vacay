import React, { useEffect, useState } from 'react'
import './home.css'
import Header from '../../components/header/Header'
import Iframe from 'react-iframe'
import divSvg from '../../assets/images/divSvg.svg'
import smallearning from '../../assets/images/smallearning.svg'
import Image from 'react-bootstrap/Image'
import { useNavigate } from 'react-router-dom'
import { styled } from 'styled-components'


export default function Home() {
  const [isOpen,setIsOpen]=useState(false)
  const navigate = useNavigate()
  const local = localStorage.getItem('isLoggedIn')

  useEffect(() => {
    (local ? (navigate('/home')) : (navigate('/login')))
  }, [local])

  return (
    <div className='bg'>

      <Header />

      <div className="dashboard d-flex">
        <AskBtn onClick={()=>{setIsOpen(true)}} style={{display:isOpen?"none":"flex"}}>
        <Image src={smallearning} alt="image" className='w-50 h-50' />

        </AskBtn>
        <AskHR style={{display:isOpen?"block":"none"}}>
          <div className='d-flex flex-row-reverse '>
            <span role="button" className='text-white me-3 mt-2' onClick={()=>setIsOpen(false)}>X</span></div>
          </AskHR>
        <Frame>
          <Iframe url="https://lookerstudio.google.com/reporting/ef1c8655-0df3-4fcd-a7d2-046a51ec44c3/page/DKpXD?s=jI8Y9vCFcQo"
            width="100%"
            height="706px"
            id=""
            className="frameContent"
            display="block"
            position="relative" />

        </Frame>
      </div>
    </div>
  )
}

const Frame = styled.div`
margin-right: 70px;
background-color: #C1C4EE;
border-radius: 11px;
margin-bottom: 20px;
margin-left: 50px;
width:85%
`
const AskHR = styled.div`
width: 380px;
height: 705px;
border-radius: 20px;
border: 2px solid rgba(191, 193, 219, 0.50);
background: #383C77;
margin-left: 70px;
background-color: #313791;
transition: transform 0.3s ease-in-out;
transform: translateX(0);
`
const AskBtn=styled.div`
background-color: #FF7842;
width: 86px;
height: 103px;
display:flex;
justify-content:center;
align-items:center;
border-top-right-radius: 11px;
border-bottom-right-radius: 11px;
&:hover{ background-color: #313791;}
`