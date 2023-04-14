import { Card, CardBody } from "reactstrap";
import { calendarSelectionBackgroundColor } from "../../styles/constants";
import styled from "styled-components";
import {
  computeNextNMonths,
  computeMonthlyData,
  getDaysInMonth,
} from "../../helpers/vacay_helpers";

const computeAvailableDays = (PTOPerMonth) => {
  const availableDays = {};
  // for each month in the PTO Per Month array, compute n days - element
  for (const [key, value] of Object.entries(PTOPerMonth)) {
    availableDays[key] = getDaysInMonth(new Date(key)) - value;
  }

  return availableDays;
};

export const CalendarSummaryGroup = ({ dashboardData, nMonthsAhead }) => {
  // 1. Compute name of N next months
  const nNextMonthNames = computeNextNMonths(
    dashboardData.currentMonth,
    nMonthsAhead
  );
  // 2. Calculate available days (right now assuming only 1 user, will add combining
  // and de-duping for multiple people shortly after
  // available days = smallest common denominator of balance for next N days or n free days
  const [PTOPerMonth, holidaysPerMonth, balance] = computeMonthlyData(
    nNextMonthNames,
    dashboardData.currentBalanceDays,
    dashboardData.bookedPTO,
    dashboardData.holidays,
    dashboardData.accrualRate,
    dashboardData.accruaCap
  );

  // TODO: compute min between available days and balance per month

  const availableDays = computeAvailableDays(PTOPerMonth);

  // 3. Render the month array

  return nNextMonthNames.map((x) => {
    return (
      <StyledCard>
        <StyledCardBody>
          <div>ICON</div>
          <div>{x}</div>
          <div>{availableDays[x]} days available</div>
        </StyledCardBody>
      </StyledCard>
    );
  });
};

const StyledCardBody = styled(CardBody)`
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
