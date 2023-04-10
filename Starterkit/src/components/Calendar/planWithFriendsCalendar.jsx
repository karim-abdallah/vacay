import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import styled from "styled-components";
import { computeNextNMonths } from "../../helpers/vacay_helpers";

export const CalendarSummaryGroup = ({
  currentMonth,
  bookedPtoDays,
  nMonthsAhead
}) => {
  // 1. Compute name of N next months

  const nNextMonthNames = computeNextNMonths(currentMonth, nMonthsAhead);
  // 2. Calculate available days (right now assuming only 1 user, will add combining
    // and de-duping for multiple people shortly after
    
  
    const daysAvailable = 18;
    
  // 3. Render the month array

    return (
        nNextMonthNames.map(x => {
                            return (
    <StyledCard>
      <StyledCardBody>
        <div>ICON</div>
        <div>{x}</div>
        <div>{daysAvailable} days available</div>
      </StyledCardBody>
    </StyledCard>
                            );
        }
                           )
    );
};

export const CalendarSelection = ({ month, daysAvailable }) => {
  return (
    <StyledCard>
      <CardBody>
        <div>ICON</div>
        <div>{month}</div>
        <div>{daysAvailable} days available</div>
      </CardBody>
    </StyledCard>
  );
};

const StyledCardBody = styled(CardBody)`
padding: 5px;
`;

const StyledCard = styled(Card)`
  margin: 0px 5px 0px;
  text-align: center;
  height: 120px;
  background-color: ${calendarSelectionBackgroundColor};
  cursor: pointer;
border: 1px solid transparent;
  &:hover {
    border: 1px solid;
  }
`;
