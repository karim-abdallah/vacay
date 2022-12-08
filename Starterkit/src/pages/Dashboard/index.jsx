//import "react-calendar/dist/Calendar.css";
import React, { Component } from "react";
import { Container, Card, CardBody } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import "../../styles/style.css";
import { computeNextTwelveMonths } from "../../helpers/vacay_helpers";
import { mockApiResponse } from "../../mocks/dashboardSummary.mock";
import styled from "styled-components";
import MiniCalendar from "../../components/Calendar/miniCalendar";
import TimeOffSettings from "../../components/TimeOffSettings/index";

class Dashboard extends Component {
  render() {
    const twelveMonths = computeNextTwelveMonths(
      mockApiResponse.currentMonth,
      "date"
    );
    const calendarArray = twelveMonths.map((item, index) => {
      return <MiniCalendar startDate={item} />;
    });
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <TimeOffSettings />
            <h1>Dashboard</h1>
            <HowToSection>
              To book time-off, expand the month to calendar view using , then
              select the desired dates and hit to reflect your changes.
            </HowToSection>
            <Card>
              <CardBody>
                <BarChart />
              </CardBody>
            </Card>
            <CalendarContainer>{calendarArray}</CalendarContainer>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const HowToSection = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 20px;
`;

export default Dashboard;
