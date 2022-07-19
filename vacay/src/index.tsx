import React from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';

class VacayHome extends React.Component {
  render() {
    return (
      <VacayBackground>
        <VacayLogo>
          VACAY
        </VacayLogo>
      </VacayBackground>);
  }
}

const VacayBackground = styled.div`
    background: #F4F7FE;
    position: relative;
    width: 100%;
    height: 100%;
`;

const VacayLogo = styled.div`
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 55px;
    line-height: 100%;
    /* identical to box height, or 55px */


    color: #2B3674
`;

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<VacayHome />);
