import React from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { GroupCard } from '../../components/Calendar/planWithFriendsCalendar';
import { selectDashboardData } from '../../store/dashboard/selector';
import { selectGroupInfo } from '../../store/planWithFriends/selectors';
import { selectProfileData } from '../../store/profile/selector';

const nMonthsAheadDefault = 6;

const PlanWithFriends = () => {
  const myProfile = useSelector(selectProfileData);
  const myDashboardData = useSelector(selectDashboardData);
  const groupData = useSelector(selectGroupInfo);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends</h2>
          {groupData.map(x => {
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

export default PlanWithFriends;
