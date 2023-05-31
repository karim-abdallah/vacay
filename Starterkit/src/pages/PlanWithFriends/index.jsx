import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { GroupCard } from '../../components/Calendar/planWithFriendsCalendar';
import { selectDashboardData } from '../../store/dashboard/selector';
import { selectGroupInfo } from '../../store/planWithFriends/selectors';
import { get } from '../../helpers/api_helper';
import { selectProfileData } from '../../store/profile/selector';

const nMonthsAheadDefault = 6;

const PlanWithFriends = () => {
  const [myProfile, setMyProfile] = useState({});

  const fetchMyProfile = async () => {
    let data = await get('/dashboard/user');
    setMyProfile({
      username: data['username'],
      email: data['email'],
      name: `${data['first_name']} ${data['last_name']}`,
      profilePic: data['profile_pic'],
    });
  };

  const myDashboardData = useSelector(selectDashboardData);
  const groupData = useSelector(selectGroupInfo);

  useEffect(() => {
    fetchMyProfile();
  }, []);

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
