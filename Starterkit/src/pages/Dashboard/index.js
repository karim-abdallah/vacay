import "react-calendar/dist/Calendar.css";
import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import Calendar from "react-calendar";
import { differenceInCalendarDays } from "date-fns";
import { bookedDays } from "../../styles/style.css";
import { computeNextTwelveMonths } from "../../helpers/vacay_helpers";
import { mockApiResponse } from "../../mocks/dashboardSummary.mock";

class Dashboard extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <Card>
              <CardBody>
                <BarChart />
              </CardBody>
            </Card>
            <Row>
              <Col>
                <MiniCalendar />
              </Col>
              <Col>
                <MiniCalendar />
              </Col>
              <Col>
                <MiniCalendar />
              </Col>
              <Col>
                <MiniCalendar />
              </Col>
              <Col>
                <MiniCalendar />
              </Col>
              <Col>
                <MiniCalendar />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

const datesToAddClassTo = [new Date("2022-11-12"), new Date("2022-10-13")];

function tileClassName({ date, view }) {
  // Add class to tiles in month view only
  if (view === "month") {
    // Check if a date React-Calendar wants to check is on the list of dates to add class to
    if (datesToAddClassTo.find((dDate) => isSameDay(dDate, date))) {
      return "bookedDays";
    }
  }
}

function isSameDay(a, b) {
  return differenceInCalendarDays(a, b) === 0;
}

const MiniCalendar = () => {
  // Need to hide navigation but still show the month label.
  // Need to set start date programatically (prob using the array used in BarChart)
  const startDates = computeNextTwelveMonths(
    mockApiResponse.currentMonth,
    "date"
  );
  console.log(startDates);

  return (
    <Calendar
      activeStartDate={startDates[0]}
      defaultView="month"
      showNeighboringMonth={null}
      tileClassName={tileClassName}
    />
  );
};

export default Dashboard;
