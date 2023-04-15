import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { CalendarSummaryGroup } from "../../components/Calendar/planWithFriendsCalendar";
import { FriendCard } from "./FriendCard";
import { selectDashboardData } from "../../store/dashboard/selector";
import { selectGroupInfo } from "../../store/planWithFriends/selectors";
import { selectProfileData } from "../../store/profile/selector";
import { getUniqueDates } from "../../helpers/vacay_helpers";

const nMonthsAheadDefault = 6;

const GroupCard = ({ myProfile, myData, groupInfo, nMonthsAhead }) => {
  const friendsData = {};
  friendsData[myProfile.name] = myData;
  groupInfo.friends.forEach((x) => (friendsData[x.name] = x.dashboard));

  const generateFriendCards = () => {
    const friendNames = Object.keys(friendsData);
    return friendNames.map((x) => {
      return <FriendCard name={x} />;
    });
  };
  // Determine bookedPTO for the whole group
  const groupBookedPTO = [];
  const arrayOfBookedDates = [];

  Object.keys(friendsData).forEach((friend) => {
    arrayOfBookedDates.push(friendsData[friend].bookedPTO.dates);
  });

  groupBookedPTO.push(getUniqueDates(arrayOfBookedDates));

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
