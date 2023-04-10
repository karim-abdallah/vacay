import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { CalendarSummaryGroup } from "../../components/Calendar/planWithFriendsCalendar";
import { FriendCard } from "./FriendCard";
import { selectDashboardData } from "../../store/dashboard/selector";

const nMonthsAheadDefault = 6;

const PlanWithFriends = () => {
  const myDashboardData = useSelector(selectDashboardData);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends</h2>
          <Card>
            <StyledCardBody>
              <FriendCard />
              <CalendarSummaryGroup
                currentMonth={myDashboardData.currentMonth}
                bookedPtoDays={myDashboardData.bookedPTO.dates}
                nMonthsAhead={nMonthsAheadDefault}
              />
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
