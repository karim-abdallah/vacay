import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { CalendarSummaryGroup } from "../../components/Calendar/planWithFriendsCalendar";
import { FriendCard } from "./FriendCard";
import { selectDashboardData } from "../../store/dashboard/selector";
import { selectGroupInfo } from "../../store/planWithFriends/selectors";
import { selectProfileData } from "../../store/profile/selector";

const nMonthsAheadDefault = 6;

const GroupCard = ({ myProfile, myData, groupInfo, nMonthsAhead }) => {
  const generateFriendCards = () => {
    const friendNames = [myProfile.name];
    groupInfo.friends.forEach((x) => friendNames.push(x.name));

    console.log(friendNames);

    return friendNames.map((x) => {
      return <FriendCard name={x} />;
    });
  };

  return (
    <Card>
      <StyledCardBody>
        <div>{generateFriendCards()}</div>
        <CalendarSummaryGroup
          dashboardData={myData}
          nMonthsAhead={nMonthsAhead}
        />
      </StyledCardBody>
    </Card>
  );
};

const PlanWithFriends = () => {
  const myProfile = useSelector(selectProfileData);
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
                myProfile={myProfile}
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
