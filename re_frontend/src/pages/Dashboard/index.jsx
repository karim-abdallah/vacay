//import "react-calendar/dist/Calendar.css";
import React from "react";
import { Container, Card, CardBody } from "reactstrap";
import { Alert } from "antd";
import { useSelector } from "react-redux";
import {
  getCurrentMonth,
  getNegativeBalanceMonths
} from "../../store/dashboard/selector";
import BarChart from "../../components/Charts/barchart";
import Legend from "../../components/Charts/legend";
import "../../styles/style.css";
import { computeNextTwelveMonths } from "../../helpers/vacay_helpers";
import styled from "styled-components";
import MiniCalendar from "../../components/Calendar/miniCalendar";
import TimeOffSettings from "../../components/TimeOffSettings/index";

const Dashboard = () => {
  const currentMonth = useSelector(getCurrentMonth);
  const negativeBalanceMonths = useSelector(getNegativeBalanceMonths);

  const twelveMonths = computeNextTwelveMonths(currentMonth, "date");
  const calendarDiv = () => {
    // Split out the calendar array into 3 sub arrays
    const calendarArray = twelveMonths.map((item, index) => {
      return <MiniCalendar startDate={item} />;
    });
    const groupedArray = [[], [], [], []];
    var groupIndex = 0;

    calendarArray.forEach((item, index) => {
      if (groupIndex > 3) {
        groupIndex = 0;
      }
      groupedArray[groupIndex].push(item);
      groupIndex += 1;
    });
    return (
      <>
        <GroupDiv>{groupedArray[0]}</GroupDiv>
        <GroupDiv>{groupedArray[1]}</GroupDiv>
        <GroupDiv>{groupedArray[2]}</GroupDiv>
        <GroupDiv>{groupedArray[3]}</GroupDiv>
      </>
    );
  };

  const generateWarning = negativeBalanceMonths => {
    return negativeBalanceMonths.length ? (
      <StyledAlert
        message={`Warning: You have exceeded the maximum number of days selected or booked for ${negativeBalanceMonths.join(
          ", "
        )}, resulting in a negative balance.`}
        closable={true}
        showIcon={true}
        type="warning"
      />
    ) : (
      ""
    );
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {generateWarning(negativeBalanceMonths)}
          <TimeOffSettings />
          <h2>Dashboard</h2>
          <Card>
            <CardBody>
              <Legend />
              <BarChart />
            </CardBody>
          </Card>
          <CalendarContainer>{calendarDiv()}</CalendarContainer>
        </Container>
      </div>
    </React.Fragment>
  );
};

const StyledAlert = styled(Alert)`
  margin-bottom: 10px;
`;

const GroupDiv = styled.div`
  flex: 1;
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export default Dashboard;
