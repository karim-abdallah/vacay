import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import styled from "styled-components";
import { FriendCard } from "../../pages/PlanWithFriends/FriendCard";
import {
  calculateBookedPTOPerMonth,
  computeNextNMonths,
  getDaysInMonth,
  getUniqueDates,
} from "../../helpers/vacay_helpers";
import calendarIcon from "../../assets/images/calendarIcon.svg";

const computeAvailableDays = (PTOPerMonth) => {
  const availableDays = {};
  // for each month in the PTO Per Month array, compute n days - element
  for (const [key, value] of Object.entries(PTOPerMonth)) {
    availableDays[key] = getDaysInMonth(new Date(key)) - value;
  }

  return availableDays;
};

export const GroupCard = ({ myProfile, myData, groupInfo, nMonthsAhead }) => {
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
          <StyledCalendarSummaryBody>
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
      <StyledCardBody>
        <div>{generateFriendCards()}</div>
        <CalendarSummaryGroup
          nNextMonthNames={nNextMonthNames}
          availableDays={availableDays}
        />
      </StyledCardBody>
    </Card>
  );
};

export const DrilldownCalendar = ({ startMonth }) => {
  // Renders header with columns in the bottom
  const CalendarDrillout = () => {
    <Card>
      <img></img>
    </Card>;
  };
  return <CalendarDrillout />;
};

const StyledImage = styled.img`
  height: 50px;
  width: 50px;
  margin-top: 5px;
  margin-bottom: 5px;
`;

const StyledCardBody = styled(CardBody)`
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
