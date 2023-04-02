import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import styled from "styled-components";

export const CalendarSelection = () => {
  return (
    <StyledCard>
      <CardBody>
        <div>Select Month</div>
      </CardBody>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  background-color: ${calendarSelectionBackgroundColor};
`;
