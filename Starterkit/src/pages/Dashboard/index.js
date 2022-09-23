import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import Calender from "../../components/Calendar/Calendar";

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
                <Calender />
              </Col>
              <Col>
                <Calender />
              </Col>
              <Col>
                <Calender />
              </Col>
              <Col>
                <Calender />
              </Col>
              <Col>
                <Calender />
              </Col>
              <Col>
                <Calender />
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

export default Dashboard;
