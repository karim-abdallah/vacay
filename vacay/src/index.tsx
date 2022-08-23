import React, { FC, useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import { Column } from '@ant-design/plots';
/* import { light, white } from './styles/colorStyles'; */
/* import NavigationPanel from './features/NavigationPanel'; */

const mock_data = [
  {
    "month": "January",
    "type": "Accrued Time Off",
    "value": 1,
  },
  {
    "month": "February",
    "type": "Accrued Time Off",
    "value": 2,
  },
  {
    "month": "March",
    "type": "Accrued Time Off",
    "value": 3,
  },
  {
    "month": "April",
    "type": "Accrued Time Off",
    "value": 1,
  },
  {
    "month": "March",
    "type": "Scheduled Time Off",
    "value": 2,
  }
]



export interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * contains the button text
   */
  text?: string;
  /**
  * name of page selected
   */
  pageSelected?: string;
  /**
  * function to execute when clicking the button
   */
  onClick?: () => void;

}

const HomeChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(mock_data);
  }, []);

  const config = {
    data,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 20, 20],
    },
  };

  return <Column {...config} />;
};


class VacayHome extends React.Component {
  render() {
    return (
      <VacayBackground>
        <VacayLogo>
          VACAY
        </VacayLogo>
        <NavigationPanel />
        <HomeChart />
      </VacayBackground>);
  };
};

const NavigationPanel: FC = () => {
  const [pageSelected, setPageSelected] = useState('Dashboard');
  return (
    <>
      <NavButton
        text="Dashboard"
        pageSelected={pageSelected}
      />
      <NavButton
        text="Profile"
        pageSelected={pageSelected}
      />
      <NavButton
        text="Connect with friends"
        pageSelected={pageSelected}
      />
      <NavButton
        text="Deals"
        pageSelected={pageSelected}
      />
    </>
  );
};

const NavButton = ({ text, pageSelected }: Props) => {
  return (

    <StyledButton
      text={text}
      pageSelected={pageSelected}
    >
      {text && <span>{text}</span>}
    </StyledButton >
  );
};

export const light = {
  'background': '#F4F7FE',
  'text': '#2B3674',
}

const white = '#FFFFFF';

const StyledButton = styled.button<Props>`
    display: flex;
    border: 0px;
    background: ${(props: { pageSelected: string, text: string }) => props.pageSelected === props.text ? white : light.background};
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
