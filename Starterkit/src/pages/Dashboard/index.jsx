//import "react-calendar/dist/Calendar.css";
import React, { Component } from "react";
import { Container, Card, CardBody } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import "../../styles/style.css";
import { bookedPtoColor, unbookColor } from "../../styles/constants";
import { computeNextTwelveMonths } from "../../helpers/vacay_helpers";
import { mockApiResponse } from "../../mocks/dashboardSummary.mock";
import styled from "styled-components";
import MiniCalendar from "../../components/Calendar/miniCalendar";
import TimeOffSettings from "../../components/TimeOffSettings/index";
import expand from "../../assets/images/expand.png";

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
            <h2>Dashboard</h2>
            <HowToSection>
              To book time-off, expand the month to calendar view using{" "}
              <MockStyledExpandButton src={expand} alt="x" />, then select the
              desired dates and hit <MockBookButton>Book</MockBookButton> to
              reflect your changes. To unbook time-off, select booked days and
              hit
              <MockUnbookButton>Unbook</MockUnbookButton>.
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

const MockStyledButton = styled.b`
  margin-bottom: 10px;
  margin-left: 5px;
  margin-right: 5px;
  padding: 3px 23px 3px;
  color: #ffffff;
  border-radius: 25px;
  font-size: 13px;
`;

const MockStyledExpandButton = styled.img`
  background-color: #e9e6f6;
  border-radius: 5px;
  height: 22px;
  padding: 5px;
`;

const MockBookButton = styled(MockStyledButton)`
  background-color: ${bookedPtoColor};
`;

const MockUnbookButton = styled(MockStyledButton)`
  background-color: ${unbookColor};
`;

const HowToSection = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;
`;

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 10px;
`;

export default Dashboard;
