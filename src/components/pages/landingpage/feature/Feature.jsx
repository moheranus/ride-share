import React from 'react';
import { Row, Col, Typography, Card } from 'antd';
import './Feature.css'
const { Title, Paragraph } = Typography;
const Feature = React.forwardRef((props, ref) => (

    <section id="featured-cars" ref={ref}>
         <div className="about-content">
            {/* <Title level={2} className="about-title">About Us</Title> */}
            <div className="nine">
            <h1>About Us<span>Explore Our Values</span></h1>
            </div>
            <Paragraph className="about-description">
                Welcome to our rideshare service! We are dedicated to providing you with a safe, reliable, and comfortable ride to your destination. Our team of professional drivers is committed to ensuring that you have the best experience possible.
            </Paragraph>

            <Row gutter={[16, 16]} className="about-section">
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} className="about-card">
                        <Title level={4} className="about-card-title">Our Mission</Title>
                        <Paragraph>
                            Our mission is to revolutionize urban transportation by providing a reliable, safe, and comfortable rideshare service that enhances the quality of life for our users.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} className="about-card">
                        <Title level={4} className="about-card-title">Our Vision</Title>
                        <Paragraph>
                            We envision a world where transportation is seamless, accessible, and sustainable, and we aim to be at the forefront of this transformation.
                        </Paragraph>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} className="about-card">
                        <Title level={4} className="about-card-title">Our Values</Title>
                        <Paragraph>
                            We value safety, reliability, customer satisfaction, and sustainability. These core values guide our operations and help us deliver exceptional service.
                        </Paragraph>
                    </Card>
                </Col>
            </Row>


        </div>
    </section>
));

export default Feature;
