import React, { FC } from 'react';
import styled from 'styled-components';

const NavigationPanel: FC = () => {
  return (
    <div>
      ActionPanel
    </div>
  )
};

const NavButton: FC = () => (
  <StyledButton>
    <span>Dashboard</span>
  </StyledButton>
);

const StyledButton = styled.button`
    display: flex;
    border: 0px;
    background:
    &:hover {
    background: #FFFFFF;
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

export default NavigationPanel;
