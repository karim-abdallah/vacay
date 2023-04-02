import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";

const PlanWithFriends = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends - COMING SOON</h2>
          <Card>
            <StyledCardBody>
              <div>Friend component</div>
              <div>Calendar component</div>
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
