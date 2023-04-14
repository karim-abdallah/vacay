import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { CalendarSummaryGroup } from "../../components/Calendar/planWithFriendsCalendar";
import { FriendCard } from "./FriendCard";
import { selectDashboardData } from "../../store/dashboard/selector";
import { selectGroupInfo } from "../../store/planWithFriends/selectors";

const nMonthsAheadDefault = 6;

const GroupCard = ({ myData, groupInfo, nMonthsAhead }) => {
  return (
    <Card>
      <StyledCardBody>
        <FriendCard />
        <CalendarSummaryGroup
          dashboardData={myData}
          nMonthsAhead={nMonthsAhead}
        />
      </StyledCardBody>
    </Card>
  );
};

const PlanWithFriends = () => {
  const myDashboardData = useSelector(selectDashboardData);
  const groupData = useSelector(selectGroupInfo);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends</h2>
          {groupData.map((x) => {
            return (
              <GroupCard
                myData={myDashboardData}
                groupInfo={x}
                nMonthsAhead={nMonthsAheadDefault}
              />
            );
          })}
        </Container>
      </div>
    </React.Fragment>
  );
};

const StyledCardBody = styled(CardBody)`
  display: flex;
`;

export default PlanWithFriends;
