import styled from "styled-components";
import {
  bookedPtoColor,
  selectionColor,
  balanceColor
} from "../../styles/constants";

export const Legend = () => {
  return (
    <StyledLegend>
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
    </StyledLegend>
  );
};

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
  margin-top: 10px;
  justify-content: end;
  display: flex;
`;

export default Legend;
