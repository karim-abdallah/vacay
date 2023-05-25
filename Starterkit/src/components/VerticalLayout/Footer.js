import React from "react";
import { Row, Col, Container } from "reactstrap";

const goToBlog = () => {
    window.open(
      "https://vacay-live.notion.site/Vacay-Blog-8bb71268be634ef2a029403032371605"
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
                            <p onClick={goToBlog} style={blogStyle}>Blog</p>
                            </Col>
                    </Row>
                </Container>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
