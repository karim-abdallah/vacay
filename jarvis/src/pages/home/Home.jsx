import React from 'react'
import './home.css'
import Header from '../../components/header/Header'
import Iframe from 'react-iframe'
import divSvg from '../../assets/images/divSvg.svg'
import smallearning from '../../assets/images/smallearning.svg'
import Image from 'react-bootstrap/Image'

export default function Home() {
  return (
    <>
      <Header />
    
      <div className="dashboard d-flex justify-content-between ">
        <div className="svg d-flex justify-content-center align-items-center">
          <Image src={smallearning} alt="image" className='w-50 h-50' />
        </div>
        <div className="frame">
          <Iframe url="https://lookerstudio.google.com/reporting/ef1c8655-0df3-4fcd-a7d2-046a51ec44c3/page/DKpXD?s=jI8Y9vCFcQo"
            width="1150px"
            height="706px"
            id=""
            className="frameContent"
            display="block"
            position="relative" />
        </div>

      </div>
    </>
  )
}
