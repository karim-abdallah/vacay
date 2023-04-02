import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import styled from "styled-components";

export const CalendarSelection = () => {
  const month = "March 2023";
  const daysAvailable = 18;
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

// Oddly the cursor thing isn't working. Fix later.
const StyledCard = styled(Card)`
  margin: 0px 15px 0px;
  text-align: center;
  height: 150px;
  width: 150px;
  background-color: ${calendarSelectionBackgroundColor};
  cursor: "pointer";
  &:hover {
    border: 1px solid;
  }
`;
