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
  const dispatch = useDispatch();
  const [myProfile, setMyProfile] = useState();
  const [groups, setGroups] = useState();
  const [myDashboardData, setMyDashboardData] = useState();

  const fetchMyProfile = async () => {
    let data = await get('/dashboard/user');
    setMyProfile({
      username: data['username'],
      email: data['email'],
      name: `${data['first_name']} ${data['last_name']}`,
      profilePic: data['profile_pic'],
    });
  };

  // This is done because if you refresh the plan with friends page it fails
  // to fetch dashboard data from back-end.
  const fetchMyDashboardData = async () => {
    let bookedDays = await get('/dashboard/booked-days');
    // TODO: Fetch holidays as well

    let booked_dates = [];
    bookedDays.forEach(days => {
      let date = new Date(days.date);
      booked_dates.push(date);
    });

    setMyDashboardData({
      bookedPTO: [...booked_dates],
    });
  };

  // Fetch groups
  const fetchGroups = async () => {
    let groups = await get('/planwithfriends/groups');
    setGroups([...groups]);
  };

  useEffect(() => {
    fetchMyProfile();
    fetchMyDashboardData();
    fetchGroups();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <h2>Plan with friends</h2>
          {myProfile !== undefined &&
            groups !== undefined &&
            myDashboardData !== undefined && // Set the ternary operator on a spinner
            groups.map(x => {
              return (
                <GroupCard
                  myProfile={myProfile}
                  myData={myDashboardData}
                  groupPayload={x}
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
