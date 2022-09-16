import React, { Component } from "react";
import { Container, Card, CardBody, Row, Col } from "reactstrap";
import BarChart from "../../components/Charts/barchart";
import Calender from "../../components/Calendar/Calendar";

//Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbItems : [
                { title : "Vacay", link : "/" },
                { title : "Dashboard", link : "#" },
            ]
        }
    }

    render() {
        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>

                <Breadcrumbs title="Dashboard" breadcrumbItems={this.state.breadcrumbItems} />
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
