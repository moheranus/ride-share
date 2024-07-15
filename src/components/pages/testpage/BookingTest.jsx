import React, { useState, useEffect } from 'react';
import { Layout, Tabs, Form, Input, DatePicker, Select, Row, Col, Radio, Button} from 'antd';
import { UserOutlined, EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import "./Booking.css";

const { Header, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

const Booking = React.forwardRef((props, ref) => {
  const [tripType, setTripType] = useState('round_trip');
  const [activeKey, setActiveKey] = useState('1');
  const [form] = Form.useForm();
  const [guestForm] = Form.useForm();
  const [bookingDetails, setBookingDetails] = useState({});
  const [guestDetails, setGuestDetails] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/services');
        const data = await response.json();
        // console.log('Fetched data:', data);
        setServices(data);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);




  const onTripTypeChange = (e) => {
    setTripType(e.target.value);
  };

  const onBookingFinish = (values) => {
    setBookingDetails(values);
    const selectedService = services.find(service => service.name === values.serviceType);
    const servicePrice = selectedService ? selectedService.price : 0;
    const finalPrice = tripType === 'round_trip' ? servicePrice * 2 : servicePrice;
    setTotalPrice(finalPrice);
    setActiveKey('2'); // Switch to Guest Details tab
  };

  const onGuestFinish = (values) => {
    setGuestDetails(values);
    setActiveKey('3');
  };

  const onConfirmationFinish = async () => {
    const bookingData = {
      ...bookingDetails,
      guestDetails: {
        ...guestDetails,
      },
      totalPrice,
      tripType, // Include tripType in the booking data
      pickupDate: bookingDetails.pickupDate.format('YYYY-MM-DD'),
      pickupTime: bookingDetails.pickupTime.format('HH:mm'),
    };

    if (tripType === 'round_trip') {
      bookingData.returnPickupDate = bookingDetails.returnPickupDate.format('YYYY-MM-DD');
      bookingData.returnPickupTime = bookingDetails.returnPickupTime.format('HH:mm');
    }

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setActiveKey('4');
      } else {
        const errorData = await response.json();
        console.error('Error submitting booking:', errorData);
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
    }
  };

  return (
    <section id="brands" ref={ref}>
      <Layout className="layout bookingContainer">

        <div className="nine addons">
          <h1>Online Booking<span>Book our service Online</span></h1>
        </div>
        <Content style={{ padding: '0 50px' }} className='tab-bg'>
          <div className="site-layout-content" style={{ marginTop: '50px' }}>
            <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} className='tabs'>
              <TabPane tab="Booking Details" key="1">
                <Form
                  form={form}
                  name="car_booking"
                  layout="vertical"
                  onFinish={onBookingFinish}
                  style={{ marginTop: '30px' }}
                >
                  <Form.Item>
                    <Radio.Group onChange={onTripTypeChange} value={tripType}>
                      <Radio value="round_trip">Round Trip</Radio>
                      <Radio value="one_way">One Way</Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="pickupAddress"
                        label="Pick-up Address"
                        rules={[{ required: true, message: 'Please input your pick-up address!' }]}
                      >
                        <Input prefix={<EnvironmentOutlined />} placeholder="Enter pick-up address" className='formInput'/>
                      </Form.Item>
                    </Col>
                    {tripType === 'round_trip' && (
                      <Col span={12}>
                        <Form.Item
                          name="returnPickupAddress"
                          label="Return Pick-up Address"
                          rules={[{ required: true, message: 'Please input your return pick-up address!' }]}
                        >
                          <Input prefix={<EnvironmentOutlined />} placeholder="Enter return pick-up address" className='formInput'/>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="dropoffAddress"
                        label="Drop Off Address"
                        rules={[{ required: true, message: 'Please input your drop-off address!' }]}
                      >
                        <Input prefix={<EnvironmentOutlined />} placeholder="Enter drop-off address" className='formInput'/>
                      </Form.Item>
                    </Col>
                    {tripType === 'round_trip' && (
                      <Col span={12}>
                        <Form.Item
                          name="returnDropoffAddress"
                          label="Return Drop Off Address"
                          rules={[{ required: true, message: 'Please input your return drop-off address!' }]}
                        >
                          <Input prefix={<EnvironmentOutlined />} placeholder="Enter return drop-off address" className='formInput'/>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="pickupDate"
                        label="Pick-up Date"
                        rules={[{ required: true, message: 'Please select a pick-up date!' }]}
                      >
                        <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} className='formInput'/>
                      </Form.Item>
                    </Col>
                    {tripType === 'round_trip' && (
                      <Col span={12}>
                        <Form.Item
                          name="returnPickupDate"
                          label="Return Pick-up Date"
                          rules={[{ required: true, message: 'Please select a return pick-up date!' }]}
                        >
                          <DatePicker style={{ width: '100%' }} prefix={<CalendarOutlined />} className='formInput'/>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="pickupTime"
                        label="Pick-up Time"
                        rules={[{ required: true, message: 'Please select a pick-up time!' }]}
                      >
                        <DatePicker style={{ width: '100%' }} showTime prefix={<ClockCircleOutlined />} className='formInput'/>
                      </Form.Item>
                    </Col>
                    {tripType === 'round_trip' && (
                      <Col span={12}>
                        <Form.Item
                          name="returnPickupTime"
                          label="Return Pick-up Time"
                          rules={[{ required: true, message: 'Please select a return pick-up time!' }]}
                        >
                          <DatePicker style={{ width: '100%' }} showTime prefix={<ClockCircleOutlined />} className='formInput'/>
                        </Form.Item>
                      </Col>
                    )}
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                    <Form.Item
                      name="serviceType"
                      label="Service Type"
                      rules={[{ required: true, message: 'Please select a service type!' }]}
                    >
                      <Select placeholder="Select a service type">
                        {Array.isArray(services) && services.map(service => (
                          <Option key={service._id} value={service.name}>{service.name}</Option>
                        ))}
                      </Select>
                    </Form.Item>


                    </Col>
                  </Row>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className='continue-btn'>
                      Save and Continue
                    </Button>
                  </Form.Item>

                  <div style={{ marginTop: '20px', fontSize: '18px' }}>
                    <strong>Total Price: ${totalPrice}</strong>
                  </div>
                </Form>
              </TabPane>
              <TabPane tab="Guest Details" key="2" disabled={activeKey < 2}>
                <Form
                  form={guestForm}
                  name="guest_details"
                  layout="vertical"
                  onFinish={onGuestFinish}
                  style={{ marginTop: '30px' }}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please input your full name!' }]}
                      >
                        <Input prefix={<UserOutlined />} placeholder="Enter your full name" className='formInput'/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[{ required: true, message: 'Please input your email address!' }]}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Enter your email address" className='formInput'/>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[{ required: true, message: 'Please input your phone number!' }]}
                      >
                        <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" className='formInput'/>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="address"
                        label="Physical Address"
                        rules={[{ required: true, message: 'Please input your physical address!' }]}
                      >
                        <Input prefix={<EnvironmentOutlined />} placeholder="Enter your physical address" className='formInput'/>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button type="primary" htmlType="submit" className='continue-btn'>
                      Save and Continue
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              <TabPane tab="Booking Summary" key="3" disabled={activeKey < 3}>
                <div style={{ marginTop: '30px' }} className='booking-summery'>
                  <div className='booking-detail'>
                    <h3>Booking Details</h3>
                    <p><span>Pick-up Address: </span> {bookingDetails.pickupAddress}</p>
                    <p><span>Drop Off Address: </span>{bookingDetails.dropoffAddress}</p>
                    <p><span>Pick-up Date: </span>{bookingDetails.pickupDate?.format('YYYY-MM-DD')}</p>
                    <p><span>Pick-up Time: </span>{bookingDetails.pickupTime?.format('HH:mm')}</p>
                    {tripType === 'round_trip' && (
                      <>
                        <p><span>Return Pick-up Address: </span>{bookingDetails.returnPickupAddress}</p>
                        <p><span>Return Drop Off Address:</span> {bookingDetails.returnDropoffAddress}</p>
                        <p><span>Return Pick-up Date: </span>{bookingDetails.returnPickupDate?.format('YYYY-MM-DD')}</p>
                        <p><span>Return Pick-up Time: </span>{bookingDetails.returnPickupTime?.format('HH:mm')}</p>
                      </>
                    )}
                    <p><span>Service Type: </span>{bookingDetails.serviceType}</p>
                    <p><span>Total Price:</span> ${totalPrice}</p>
                  </div>
                  <div className='guest-detail'>
                    <h3>Guest Details</h3>
                    <p><span>Full Name: </span>{guestDetails.name}</p>
                    <p><span>Email Address: </span>{guestDetails.email}</p>
                    <p><span>Phone Number:</span> {guestDetails.phone}</p>
                    <p><span>Physical Address:</span> {guestDetails.address}</p>
                    <Button type="primary" onClick={onConfirmationFinish} className='continue-btn'>
                      Confirm and Submit
                    </Button>
                  </div>
                </div>
              </TabPane>
              <TabPane tab="Confirmation" key="4" disabled={activeKey < 4}>
                <div style={{ marginTop: '30px' }}>
                  <h3>Booking Confirmed</h3>
                  <p>Thank you for booking with us. We have received your booking details and will process your request shortly.</p>
                </div>
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </section>
  );
});

export default Booking;
