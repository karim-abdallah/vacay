import styled from 'styled-components';
import { getPTOSettings } from '../../store/dashboard/selector';
import { PolicyTypes } from '../../constants.js';
import { useSelector } from 'react-redux';
import {
  bookedPtoColor,
  selectionColor,
  balanceColor,
} from '../../styles/constants';

export const Legend = () => {
  const ptoSettings = useSelector(getPTOSettings);
  const accrualType = ptoSettings.PTOSettings.accrualType;

  return (
    <StyledLegend>
      <StyledDaysLegend>Days</StyledDaysLegend>
      <FlexContainer>
        <FlexDiv color={bookedPtoColor}>
          <Circle />
          Days Booked
        </FlexDiv>
        <FlexDiv color={selectionColor}>
          <Circle />
          Selected Dates
        </FlexDiv>
        {accrualType === PolicyTypes.accrual && (
          <FlexDiv color={balanceColor}>
            <Circle />
            Your Balance
          </FlexDiv>
        )}
        <HolidayFlexDiv>
          <HolidayCircle />
          Holidays
        </HolidayFlexDiv>
      </FlexContainer>
    </StyledLegend>
  );
};

const StyledDaysLegend = styled.b`
  color: #a3aed0;
  flex-grow: 1;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-grow: 1;
`;

const HolidayFlexDiv = styled.div`
  display: flex;
  color: ${bookedPtoColor};
`;

const Circle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
`;

const HolidayCircle = styled(Circle)`
  background-color: white;
  color: ${bookedPtoColor};
  border: 3px solid;
`;

const FlexDiv = styled.div`
  display: flex;
  color: ${props => props.color};
  > * {
    background-color: ${props => props.color};
  }
`;

const StyledLegend = styled.div`
  margin-top: 7px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 7px;
`;

export default Legend;
