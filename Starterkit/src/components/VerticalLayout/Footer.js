import React from "react";
import { Row, Col, Container } from "reactstrap";

const goToFeedback = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSewOeenbHvlcb2GK1uOXSvZ05iW8EATairwJbXPNHIk4lzDow/viewform"
    );
  };
const Footer = () => {
    const blogStyle = {
        cursor: "pointer",
    }
    return (
        <React.Fragment>
            <footer className="footer">
                <Container fluid>
                    <Row>
                        <Col sm={9}>
                            {new Date().getFullYear()} © Vacay. All Rights Reserved. Made with <i className="mdi mdi-heart text-danger"></i>
                        </Col>
                        <Col sm={3} className="text-end">
                            <p onClick={goToFeedback} style={blogStyle}>Blog</p>
                            </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
