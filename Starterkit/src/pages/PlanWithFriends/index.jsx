import React, { useState, useEffect } from 'react';
import { Container, Card, CardBody } from 'reactstrap';
import { GroupCard } from '../../components/Calendar/planWithFriendsCalendar';
import { get } from '../../helpers/api_helper';
import { CreateGroup } from './CreateGroup';

const nMonthsAheadDefault = 6;

const PlanWithFriends = () => {
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

    setMyDashboardData({
      bookedPTO: [...bookedDays],
    });
  };

  // Fetch groups
  const fetchGroups = async () => {
    let groups = await get('/planwithfriends/groups');
    let formatted_groups = groups.map(x => {
      return {
        groupInfo: x.group_info,
        guests: x.guests.map(x => {
          return {
            ...x,
            profilePic: x.profile_pic,
            acceptedInvitation: x.accepted_invitation,
            acceptedBooking: x.accepted_booking,
            dashboard: {
              ...x.dashboard,
              bookedPTO: [...x.dashboard.booked_PTO],
              timeOffSetting: { ...x.dashboard.time_off_setting },
            },
          };
        }),
      };
    });
    setGroups([...formatted_groups]);
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
          <CreateGroup />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PlanWithFriends;
