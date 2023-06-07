import { Card, CardBody } from 'reactstrap';
import { calendarSelectionBackgroundColor } from '../../styles/constants';
import { useState } from 'react';
import styled from 'styled-components';
import { FriendCard } from '../../pages/PlanWithFriends/FriendCard';
import {
  calculateBookedPTOPerMonth,
  computeNextNMonths,
  getDaysInMonth,
  getUniqueDates,
  getCurrentMonth,
} from '../../helpers/vacay_helpers';
import calendarIcon from '../../assets/images/calendarIcon.svg';
import { defaultMonths } from '../../constants';

const nDaysInHeader = 35;

const computeAvailableDays = PTOPerMonth => {
  const availableDays = {};
  // for each month in the PTO Per Month array, compute n days - element
  for (const [key, value] of Object.entries(PTOPerMonth)) {
    availableDays[key] = getDaysInMonth(key) - value;
  }

  return availableDays;
};

export const GroupCard = ({
  myProfile,
  myData,
  groupPayload,
  nMonthsAhead,
}) => {
  const [isDrilldown, setIsDrilldown] = useState(false);
  const [drilledDownMonth, setDrilledDownMonth] = useState(null);

  const handleShowDrilldown = selectedMonth => {
    setIsDrilldown(!isDrilldown);
    if (selectedMonth) {
      setDrilledDownMonth(selectedMonth);
    }
  };
  // 1. Compute name of N next months
  const nNextMonthNames = computeNextNMonths(getCurrentMonth(), nMonthsAhead);

  // 2. Compute group data
  const friendsData = {};
  friendsData[myProfile.name] = {
    dashboardData: myData,
    profilePic: myProfile.profilePic,
  };

  groupPayload.guests.forEach(x => {
    friendsData[x.name] = {
      dashboardData: x.dashboard,
      profilePic: x.profilePic,
    };
  });

  const generateFriendCards = () => {
    // TODO: pass in status of accepted invite for friend
    const friendNames = Object.keys(friendsData);
    return friendNames.map(x => {
      return <FriendCard name={x} profilePic={friendsData[x].profilePic} />;
    });
  };

  // Determine bookedPTO for the whole group
  const arrayOfBookedDates = [];

  Object.keys(friendsData).forEach(friend => {
    if (friendsData[friend].dashboardData.bookedPTO) {
      arrayOfBookedDates.push(friendsData[friend].dashboardData.bookedPTO);
    }
  });

  const groupBookedPTO = getUniqueDates(arrayOfBookedDates);

  // Group dates by month of the year
  const groupPTOPerMonth = calculateBookedPTOPerMonth(
    groupBookedPTO,
    nNextMonthNames
  );
  const availableDays = computeAvailableDays(groupPTOPerMonth);

  const CalendarSummaryGroup = ({ nNextMonthNames, availableDays }) => {
    return nNextMonthNames.map(x => {
      return (
        <StyledSummaryCard>
          <StyledCalendarSummaryBody onClick={() => handleShowDrilldown(x)}>
            <StyledImage src={calendarIcon} alt="ICON" />
            <div>{x}</div>
            <div>{availableDays[x]} days available</div>
          </StyledCalendarSummaryBody>
        </StyledSummaryCard>
      );
    });
  };

  return (
    <Card>
      <CardBody>
        <StyledPlanWithFriendsGrid>
          {' '}
          {isDrilldown && (
            <DrilldownCalendar
              mainMonth={drilledDownMonth}
              onClickDrilldownHandler={handleShowDrilldown}
            />
          )}
          <StyledFriendsElement>
            <div>{generateFriendCards()}</div>
          </StyledFriendsElement>
          {!isDrilldown ? (
            <SummaryGrid>
              <CalendarSummaryGroup
                nNextMonthNames={nNextMonthNames}
                availableDays={availableDays}
              />
            </SummaryGrid>
          ) : (
            <div>Friends details</div>
          )}
        </StyledPlanWithFriendsGrid>
      </CardBody>
    </Card>
  );
};

export const DrilldownCalendar = ({ mainMonth, onClickDrilldownHandler }) => {
  // Renders header with columns in the bottom

  const CalendarDrillout = () => {
    return (
      <StyledDrillout onClick={() => onClickDrilldownHandler(null)}>
        <StyledDrilledoutImage src={calendarIcon} alt="ICON" />
      </StyledDrillout>
    );
  };

  const DayColumns = ({ mainMonth }) => {
    // 1. generate array of days in order
    const startDayOfMainMonth = 1; // TODO: eventually replace with dynamic value
    const daysArray = [];
    const nDaysMainMonth = getDaysInMonth(mainMonth);
    for (let n = startDayOfMainMonth; n < nDaysMainMonth + 1; n++) {
      daysArray.push(n);
    }

    for (let n = 1; n < nDaysInHeader - nDaysMainMonth + 1; n++) {
      daysArray.push(n);
    }

    // 2. Loop through and return day object with parameter.
    return daysArray.map((x, index) => {
      return <Day day={index}>{x}</Day>;
    });
  };

  const getMonthName = monthYearString => {
    const monthDate = new Date(monthYearString);
    return defaultMonths[monthDate.getMonth()];
  };

  const getNextMonthName = monthYearString => {
    const monthDate = new Date(monthYearString);
    return defaultMonths[monthDate.getMonth() + 1];
  };

  const mockDay = 3;
  return (
    <>
      <DrilloutContainer>
        <CalendarDrillout />
      </DrilloutContainer>
      <StyledHeaderDiv>
        <StyledHeaderGrid>
          <MainMonth nDaysInMonth={getDaysInMonth(mainMonth)}>
            {getMonthName(mainMonth)}
          </MainMonth>
          <SecondaryMonth nDaysInPreviousMonth={getDaysInMonth(mainMonth)}>
            {getNextMonthName(mainMonth)}
          </SecondaryMonth>
          <DayColumns mainMonth={mainMonth} />
        </StyledHeaderGrid>
      </StyledHeaderDiv>
    </>
  );
};

const headerHeight = '60px';

const StyledHeaderGrid = styled.div`
  margin-left: 15px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(${nDaysInHeader}, 1fr);
  height: ${headerHeight};
`;

const HeaderCard = styled(Card)`
  border-radius: 8px;
  background-color: ${calendarSelectionBackgroundColor};
  display: flex;
  justify-content: center;
  margin-bottom: 0px;
  text-align: center;
`;

const Day = styled(HeaderCard)`
  grid-column: ${props => props.day + 1};
  grid-row: 2;
`;

const MainMonth = styled(HeaderCard)`
  grid-column: 1 / ${props => props.nDaysInMonth + 1};
  grid-row: 1;
  margin-bottom: 2px;
`;

const SecondaryMonth = styled(HeaderCard)`
  grid-column: ${props => props.nDaysInPreviousMonth + 1} / ${nDaysInHeader + 1};
  grid-row: 1;
  margin-bottom: 2px;
`;

const StyledHeaderDiv = styled.div`
  display: flex;
  justify-content: right;
  grid-template-columns: 1/5;
  width: 100%;
`;

const DrilloutContainer = styled.div`
  grid-column: 1;
  grid-row: 1;
  display: flex;
  justify-content: right;
`;

const StyledDrillout = styled(Card)`
  margin-bottom: 0px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: ${headerHeight};
  width: ${headerHeight};
  background-color: ${calendarSelectionBackgroundColor};
  border: 1px solid transparent;
  &:hover {
    border: 1px solid;
  }
`;

const StyledDrilledoutImage = styled.img`
  margin-left: 14px;
  height: 30px;
  width: 30px;
`;

const StyledImage = styled.img`
  height: 50px;
  width: 50px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const StyledFriendsElement = styled.div`
  display: flex;
  width: 100%;
`;

const StyledCalendarSummaryBody = styled(CardBody)`
  padding: 5px;
`;

const SummaryGrid = styled.div`
  display: flex;
  justify-content: space-between;
  grid-column: 2;
  grid-row: 1;
`;

const StyledSummaryCard = styled(Card)`
  text-align: center;
  height: 120px;
  background-color: ${calendarSelectionBackgroundColor};
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid;
  }
`;

const StyledPlanWithFriendsGrid = styled.div`
  display: grid;
  gap: 5px;
  grid-template-columns: 1fr 4fr;
`;
