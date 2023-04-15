import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import { useState } from "react";
import styled from "styled-components";
import { FriendCard } from "../../pages/PlanWithFriends/FriendCard";
import {
  calculateBookedPTOPerMonth,
  computeNextNMonths,
  getDaysInMonth,
  getUniqueDates,
} from "../../helpers/vacay_helpers";
import calendarIcon from "../../assets/images/calendarIcon.svg";

const nDaysInHeader = 35;

const computeAvailableDays = (PTOPerMonth) => {
  const availableDays = {};
  // for each month in the PTO Per Month array, compute n days - element
  for (const [key, value] of Object.entries(PTOPerMonth)) {
    availableDays[key] = getDaysInMonth(key) - value;
  }

  return availableDays;
};

export const GroupCard = ({ myProfile, myData, groupInfo, nMonthsAhead }) => {
  const [isDrilldown, setIsDrilldown] = useState(false);
  const [drilledDownMonth, setDrilledDownMonth] = useState(null);

  const handleShowDrilldown = () => {
    setIsDrilldown(!isDrilldown);
  };
  // 1. Compute name of N next months
  const nNextMonthNames = computeNextNMonths(myData.currentMonth, nMonthsAhead);

  // 2. Compute group data
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
  const arrayOfBookedDates = [];

  Object.keys(friendsData).forEach((friend) => {
    arrayOfBookedDates.push(friendsData[friend].bookedPTO.dates);
  });

  const groupBookedPTO = getUniqueDates(arrayOfBookedDates);

  // Group dates by month of the year
  const groupPTOPerMonth = calculateBookedPTOPerMonth(
    groupBookedPTO,
    nNextMonthNames
  );
  const availableDays = computeAvailableDays(groupPTOPerMonth);

  const CalendarSummaryGroup = ({ nNextMonthNames, availableDays }) => {
    return nNextMonthNames.map((x) => {
      return (
        <StyledCard>
          <StyledCalendarSummaryBody onClick={handleShowDrilldown}>
            <StyledImage src={calendarIcon} alt="ICON" />
            <div>{x}</div>
            <div>{availableDays[x]} days available</div>
          </StyledCalendarSummaryBody>
        </StyledCard>
      );
    });
  };

  return (
    <Card>
      <CardBody>
        {" "}
        {isDrilldown && (
          <DrilldownCalendar
            mainMonth={myData.currentMonth}
            onClickDrilldownHandler={handleShowDrilldown}
          />
        )}
        <StyledFriendsElement>
          <div>{generateFriendCards()}</div>
          {isDrilldown ? (
            <div>FRIEND AVAILABILITIES</div>
          ) : (
            <CalendarSummaryGroup
              nNextMonthNames={nNextMonthNames}
              availableDays={availableDays}
            />
          )}
        </StyledFriendsElement>
      </CardBody>
    </Card>
  );
};

export const DrilldownCalendar = ({ mainMonth, onClickDrilldownHandler }) => {
  // Renders header with columns in the bottom
  const CalendarDrillout = () => {
    return (
      <StyledDrillout onClick={onClickDrilldownHandler}>
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

  const mockDay = 3;
  return (
    <StyledHeaderDiv>
      <CalendarDrillout />
      <StyledHeaderGrid>
        <MainMonth>June</MainMonth>
        <SecondaryMonth>July</SecondaryMonth>
        <DayColumns mainMonth={mainMonth} />
      </StyledHeaderGrid>
    </StyledHeaderDiv>
  );
};

const headerHeight = "60px";

const StyledHeaderGrid = styled.div`
  margin-left: 15px;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(${nDaysInHeader}, 1fr);
  height: ${headerHeight};
  width: 860px;
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
  grid-column: ${(props) => props.day + 1};
  grid-row: 2;
`;

const MainMonth = styled(HeaderCard)`
  grid-column: 1/31;
  grid-row: 1;
  margin-bottom: 2px;
`;

const SecondaryMonth = styled(HeaderCard)`
  grid-column: 31 / ${nDaysInHeader + 1};
  grid-row: 1;
  margin-bottom: 2px;
`;

const StyledHeaderDiv = styled.div`
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
`;

const StyledCalendarSummaryBody = styled(CardBody)`
  padding: 5px;
`;

const StyledCard = styled(Card)`
  margin: 0px 5px 0px;
  text-align: center;
  height: 120px;
  background-color: ${calendarSelectionBackgroundColor};
  cursor: pointer;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid;
  }
`;
