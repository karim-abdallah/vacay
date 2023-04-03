import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { CalendarSelection } from "../../components/Calendar/planWithFriendsCalendar";
import { FriendCard } from "./FriendCard";

const PlanWithFriends = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends</h2>
          <Card>
            <StyledCardBody>
              <FriendCard />
              <CalendarSelection />
            </StyledCardBody>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};

const StyledCardBody = styled(CardBody)`
  display: flex;
`;

export default PlanWithFriends;
