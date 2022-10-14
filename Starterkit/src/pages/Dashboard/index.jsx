import "react-calendar/dist/Calendar.css";
import React, { Component } from "react";
import { Container, Card, CardBody } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import Calendar from "react-calendar";
import { differenceInCalendarDays } from "date-fns";
import { bookedDays } from "../../styles/style.css";
import { computeNextTwelveMonths } from "../../helpers/vacay_helpers";
import { mockApiResponse } from "../../mocks/dashboardSummary.mock";
import styled from "styled-components";

const MiniCalendar = ({ startDate }) => {
  // Need to hide navigation but still show the month label.
  const datesToAddClassTo = [new Date("2022-11-12"), new Date("2022-10-13")];
  // pull the redux value for booked days for the given month
  // should be an array of days. When the array gets updated, pull it again and recompute the component.
  // When setting values, should update the redux store
  // pull the redux value for holiday
  function tileFormatting({ date, view }) {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (datesToAddClassTo.find((dDate) => isSameDay(dDate, date))) {
        return "bookedDays";
      }
    }
  }

  return (
    <Calendar
      activeStartDate={startDate}
      defaultView="month"
      showNeighboringMonth={null}
      tileClassName={tileFormatting}
      selectRange={true}
      prevLabel={null}
      prev2Label={null}
      next2Label={null}
      nextLabel={null}
    />
  );
};

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

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

const CalendarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

export default Dashboard;
