import styled from "styled-components";
import {
  bookedPtoColor,
  selectionColor,
  balanceColor
} from "../../styles/constants";

export const Legend = () => {
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
        <FlexDiv color={balanceColor}>
          <Circle />
          Your Balance
        </FlexDiv>
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
`;

const FlexContainer = styled.div`
  display: flex;
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
  justify-content: space-between;
  margin-bottom: 7px;
`;

export default Legend;
