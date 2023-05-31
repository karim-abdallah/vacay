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

  const fetchMyDashboardData = async () => {
    let bookedDays = await get('/dashboard/booked-days');

    let booked_dates = [];
    bookedDays.forEach(days => {
      let date = new Date(days.date);
      booked_dates.push(date);
    });

    dispatch({ type: 'bookedPTO/add', payload: [...booked_dates] });
  };

  useEffect(() => {
    fetchMyProfile();
    fetchMyDashboardData();
  }, []);

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
