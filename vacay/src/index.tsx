import React, { FC } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
/* import { light, white } from './styles/colorStyles'; */
/* import NavigationPanel from './features/NavigationPanel'; */

class VacayHome extends React.Component {
  render() {
    return (
      <VacayBackground>
        <VacayLogo>
          VACAY
        </VacayLogo>
        <NavButton />
      </VacayBackground>);
  };
};

const NavButton: FC = () => (
  <StyledButton>
    <span>Dashboard</span>
  </StyledButton>
);

export const light = {
  'background': '#F4F7FE',
  'text': '#2B3674',
}

const white = '#FFFFFF';

const StyledButton = styled.button`
display: flex;
border: 0px;
background: ${light.background};
    &:hover {
    background: ${white};
    }
    span {
    font-family: 'DM Sans';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 30px;
    /* identical to box height, or 125% */

    letter-spacing: -0.02em;

    color: #2B3674;
    }
`;

const VacayBackground = styled.html`
    background: #F4F7FE;
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
