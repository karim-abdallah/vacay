import styled from "styled-components";
import {
  bookedPtoColor,
  selectionColor,
  balanceColor
} from "../../styles/constants";

export const Legend = () => {
  return (
    <StyledLegend>
      <FlexDiv>
        <Circle color={bookedPtoColor} />
        Days Booked
      </FlexDiv>
      <FlexDiv>
        <Circle color={selectionColor} />
        Selected Dates
      </FlexDiv>
      <FlexDiv>
        <Circle color={balanceColor} />
        Your Balance
      </FlexDiv>
      <FlexDiv>
        <HolidayCircle color="white" />
        Holidays
      </FlexDiv>
    </StyledLegend>
  );
};

const Circle = styled.div`
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 10px;
  margin-left: 10px;
`;

const HolidayCircle = styled(Circle)`
  color: ${bookedPtoColor};
  border: 3px solid;
`;

const FlexDiv = styled.div`
  display: flex;
`;

const StyledLegend = styled.div`
  margin-top: 10px;
  justify-content: end;
  display: flex;
`;

export default Legend;
