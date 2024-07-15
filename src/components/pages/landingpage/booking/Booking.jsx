import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Form, Input, DatePicker, message, TimePicker, Button } from 'antd';
import moment from 'moment';
import axios from 'axios';
import "./Booking.css";

const { Content } = Layout;

const Booking = React.forwardRef((props, ref) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tripType, setTripType] = useState('oneWay');
  const [serviceType, setServiceType] = useState('');
  const [bookingData, setBookingData] = useState({});

  const handleNext = (values) => {
    setBookingData({ ...bookingData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = async () => {
    try {
      const response = await axios.post('/api/bookings', { ...bookingData, serviceType, tripType });
      if (response.status === 200) {
        message.success('Booking successful');
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      message.error('Booking failed. Please try again.');
    }
  };

  const renderBookingForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form layout="vertical" onFinish={handleNext}>
            <Form.Item
              name="serviceType"
              label="Select Service"
              rules={[{ required: true, message: 'Please select a service type' }]}
            >
              <select onChange={(e) => setServiceType(e.target.value)} value={serviceType} className='select-form'>
                <option value="">Select Service</option>
                <option value="service1">Service 1</option>
                <option value="service2">Service 2</option>
              </select>
            </Form.Item>
            <Form.Item
              name="tripType"
              label="Trip Type"
              rules={[{ required: true, message: 'Please select a trip type' }]}
            >
              <select onChange={(e) => setTripType(e.target.value)} value={tripType} className='select-form'>
                <option value="oneWay">One Way</option>
                <option value="roundTrip">Round Trip</option>
              </select>
            </Form.Item>
            <Form.Item
              name="pickupAddress"
              label="Pickup Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
              <Input placeholder="Enter the pickup address" className='select-form' />
            </Form.Item>
            <Form.Item
              name="pickupDate"
              label="Pickup Date"
              rules={[{ required: true, message: 'Please select the pickup date' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                disabledDate={(current) => current && current < moment().startOf('day')}
                className='select-form'
                defaultValue={moment()}
              />
            </Form.Item>
            <Form.Item
              name="pickupTime"
              label="Pickup Time"
              rules={[{ required: true, message: 'Please select the pickup time' }]}
            >
              <TimePicker
                style={{ width: '100%' }}
                className='select-form'
                defaultValue={moment()}
              />
            </Form.Item>
            {tripType === 'roundTrip' && (
              <>
                <Form.Item
                  name="returnAddress"
                  label="Return Address"
                  rules={[{ required: true, message: 'Please enter the return address' }]}
                >
                  <Input placeholder="Enter the return address" className='select-form' />
                </Form.Item>
                <Form.Item
                  name="returnDate"
                  label="Return Date"
                  rules={[{ required: true, message: 'Please select the return date' }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                      const pickupDate = bookingData.pickupDate || moment().startOf('day');
                      return current && current <= pickupDate;
                    }}
                    className='select-form'
                    defaultValue={moment()}
                  />
                </Form.Item>
                <Form.Item
                  name="returnTime"
                  label="Return Time"
                  rules={[{ required: true, message: 'Please select the return time' }]}
                >
                  <TimePicker
                    style={{ width: '100%' }}
                    className='select-form'
                    defaultValue={moment()}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} className='next-btn'>
                Next
              </Button>
            </Form.Item>
          </Form>
        );
      case 1:
        return (
          <Form layout="vertical" onFinish={handleNext}>
            <Form.Item
              name="guestName"
              label="Guest Name"
              rules={[{ required: true, message: 'Please enter the guest name' }]}
            >
              <Input placeholder="Enter the guest name" className='select-form' />
            </Form.Item>
            <Form.Item
              name="guestEmail"
              label="Guest Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter the guest email" className='select-form' />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }} className='next-btn'>
                Next
              </Button>
            </Form.Item>
            <Form.Item>
              <Button style={{ width: '100%' }} onClick={handlePrev} className='prev-btn'>
                Previous
              </Button>
            </Form.Item>
          </Form>
        );
      case 2:
        return (
          <>
            <div>
              <h3>Booking Summary</h3>
              <p><strong>Service Type:</strong> {serviceType}</p>
              <p><strong>Trip Type:</strong> {tripType}</p>
              <p><strong>Pickup Address:</strong> {bookingData.pickupAddress}</p>
              <p><strong>Pickup Date:</strong> {bookingData.pickupDate?.format('YYYY-MM-DD')}</p>
              <p><strong>Pickup Time:</strong> {bookingData.pickupTime?.format('HH:mm')}</p>
              {tripType === 'roundTrip' && (
                <>
                  <p><strong>Return Address:</strong> {bookingData.returnAddress}</p>
                  <p><strong>Return Date:</strong> {bookingData.returnDate?.format('YYYY-MM-DD')}</p>
                  <p><strong>Return Time:</strong> {bookingData.returnTime?.format('HH:mm')}</p>
                </>
              )}
              <p><strong>Guest Name:</strong> {bookingData.guestName}</p>
              <p><strong>Guest Email:</strong> {bookingData.guestEmail}</p>
            </div>
            <Button type="primary" style={{ width: '100%', marginBottom: '10px' }} onClick={handleNext} className='next-btn'>
              Next
            </Button>
            <Button style={{ width: '100%' }} onClick={handlePrev} className='prev-btn'>
              Previous
            </Button>
          </>
        );
      case 3:
        return (
          <div>
            <h3>Confirmation</h3>
            <p>Your booking has been confirmed. Thank you!</p>
            <Button type="primary" style={{ width: '100%' }} onClick={handleBookingSubmit} className='submit-btn'>
              Submit Booking
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="brands" ref={ref}>
      <Layout className="layout bookingContainer">
        <div className="nine addons bookintestheader">
          <h1>Online Booking<span>Book our service Online</span></h1>
        </div>
        <Content style={{ padding: '0 50px ' }} className='tab-bg'>
          <div className="site-layout-content" style={{ marginTop: '50px' }}>
            <div className='step-form-container'>
              <div className="steps-sidebars">
                <div className={`step-item ${currentStep === 0 ? 'active' : ''}`}>
                  <div className="step-circle">1</div>
                  <span>Booking Details</span>
                </div>
                <div className={`step-item ${currentStep === 1 ? 'active' : ''}`}>
                  <div className="step-circle">2</div>
                  <span>Guest Details</span>
                </div>
                <div className={`step-item ${currentStep === 2 ? 'active' : ''}`}>
                  <div className="step-circle">3</div>
                  <span>Booking Summary</span>
                </div>
                <div className={`step-item ${currentStep === 3 ? 'active' : ''}`}>
                  <div className="step-circle">4</div>
                  <span>Confirmation</span>
                </div>
              </div>
              <div className="form-contents">
                {renderBookingForm()}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </section>
  );
});

export default Booking;
