import React from "react";
import { Row, Col, Container } from "reactstrap";

const Footer = () => {
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={6}>
                            {new Date().getFullYear()} © Vacay. All Rights Reserved. Made with <i className="mdi mdi-heart text-danger"></i>
                            </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
