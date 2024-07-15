import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, Button, message, Drawer, Form, Input, DatePicker, TimePicker,Select, Radio, AutoComplete} from 'antd';
import { useAuth } from '../../../../authcontext/AuthContext';
import moment from 'moment';
import axios from 'axios';
import "./Service.css";
import ServiceSlider from './ServiceSlider';


const { Title, Paragraph } = Typography;
const { Option } = Select;
const Service = React.forwardRef((props, ref) => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [serviceType, setServiceType] = useState('');
  const [pendingServiceType, setPendingServiceType] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [tripType, setTripType] = useState('oneWay');
  const [bookingData, setBookingData] = useState({});
  // const [numberOfPassengers, setNumberOfPassengers] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [radioSelected, setRadioSelected] = useState(false);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [dropOffOptions, setDropOffOptions] = useState([]);
  const [routes, setRoutes] = useState([]);

  const fetchRoutes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/routes');
      return res.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching routes:', error);
      return []; // Return an empty array or handle the error as needed
    }
  };


  useEffect(() => {
    const fetchRoutesAndSetState = async () => {
      try {
        const routesData = await fetchRoutes();
        setRoutes(routesData); // Set the routes state
        // Optionally, update pickupOptions and dropOffOptions here if needed
      } catch (error) {
        console.error('Error setting routes state:', error);
      }
    };

    fetchRoutesAndSetState();
  }, []);

  const handlePickupInputChange = async (value) => {
    if (!value) {
      setPickupOptions([]);
      return;
    }

    try {
      const results = await fetchRoutes();
      const filteredOptions = results.filter(route =>
        route.routeName.toLowerCase().startsWith(value.toLowerCase())
      );
      setPickupOptions(filteredOptions.map(route => ({ value: route.routeName })));
    } catch (error) {
      console.error('Error handling pickup input change:', error);
    }
  };

  const handleDropOffInputChange = async (value) => {
    if (!value) {
      setDropOffOptions([]);
      return;
    }

    try {
      const results = await fetchRoutes();
      const filteredOptions = results.filter(route =>
        route.routeName.toLowerCase().startsWith(value.toLowerCase())
      );
      setDropOffOptions(filteredOptions.map(route => ({ value: route.routeName })));
    } catch (error) {
      console.error('Error handling drop-off input change:', error);
    }
  };

useEffect(() => {
    if (vehicles.length === 0) {
      fetchVehicles();
    }
  }, []);



  const fetchVehicles = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/vehicles');
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      message.error('Failed to fetch vehicles');
    }
  };

  const handleChooseCar = () => {
    setRadioSelected(true);
    fetchVehicles();
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    console.log('Selected Vehicle:', vehicle);
  };

  const handleBookNow = (type) => {
    if (isAuthenticated) {
      setServiceType(type);
      setDrawerVisible(true);
    } else {
      setPendingServiceType(type);
      setShowModal(true);
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginForm) {
      try {
        const role = await login(formData.username, formData.password);
        message.success(`Logged in as: ${role}`);
        setShowModal(false);
        setServiceType(pendingServiceType);
        setDrawerVisible(true);
      } catch (error) {
        console.error(error);
        message.error('Login failed');
      }
    }
  };

  const handleNext = (values) => {
    setBookingData({ ...bookingData, ...values });
    setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = () => {
    console.log('Booking details:', bookingData, 'Service type:', serviceType);
    message.success('Booking successful');
    setDrawerVisible(false);
  };

  const renderBookingForm = () => {
    switch (serviceType) {
      case 'Airport Service':
        return renderAirportServiceForm();
      case 'Point to Point Service':
        return renderPointToPointServiceForm();
      case 'Hourly Charter':
        return renderHourlyCharterForm();
      default:
        return null;
    }
  };


  const renderAirportServiceForm = () => {
    // Customize the form fields for Airport Service
    switch (currentStep) {
      case 0:
        return (
          <Form layout="vertical" onFinish={handleNext} id='airportForm'>
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
<AutoComplete
    placeholder="Enter the pickup address"
    options={pickupOptions}
    onChange={handlePickupInputChange}
  />
</Form.Item>


            <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="selectedVehicleId"
        label="Selected Vehicle"
        rules={[{ required: true, message: 'Please select a vehicle' }]}
        style={{ display: 'none' }}
      >
        <input value={selectedVehicle ? selectedVehicle.id : ''} />
      </Form.Item>

            {tripType === 'roundTrip' && (
              <>


                <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="selectedVehicleId"
        label="Selected Vehicle"
        rules={[{ required: true, message: 'Please select a vehicle' }]}
        style={{ display: 'none' }}
      >
        <input value={selectedVehicle ? selectedVehicle.id : ''} />
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
              <Input placeholder="Enter the guest name" className='select-form'/>
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
              <p><strong>Trip Type:</strong> {tripType}</p>
              <p><strong>Pickup Address:</strong> {bookingData.pickupAddress}</p>

              <p><strong>Guest Name:</strong> {bookingData.guestName}</p>
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

  const renderPointToPointServiceForm = () => {
    // Customize the form fields for Point to Point Service
    switch (currentStep) {
      case 0:
        return (
          <Form layout="vertical" onFinish={handleNext} id='pointtopointForm'>
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
        <AutoComplete
          placeholder="Enter the pickup address"
          className='select-form'
          options={pickupOptions.map((address) => ({ value: address }))}
          onChange={handlePickupInputChange}
        />
      </Form.Item>
      <Form.Item
        name="dropOffAddress"
        label="Drop Off Address"
        rules={[{ required: true, message: 'Please enter the drop off address' }]}
      >
       <AutoComplete
    placeholder="Enter the drop off address"
    options={pickupOptions}
    onChange={handlePickupInputChange}
  />
      </Form.Item>
            <Form.Item
              name="pickupDate"
              label="Pickup Date"
              rules={[{ required: true, message: 'Please select the pickup date' }]}
            >
              <DatePicker style={{ width: '100%' }} disabledDate={(current) => current && current < moment().startOf('day')} className='select-form'/>
            </Form.Item>
            <Form.Item
              name="pickupTime"
              label="Pickup Time"
              rules={[{ required: true, message: 'Please select the pickup time' }]}
            >
              <TimePicker
  style={{ width: '100%' }}
  className='select-form'
  disabledHours={() => {
    const hours = [];
    for (let i = 0; i < moment().hour(); i++) {
      hours.push(i);
    }
    return hours;
  }}
  disabledMinutes={(selectedHour) => {
    if (selectedHour === moment().hour()) {
      const minutes = [];
      for (let i = 0; i < moment().minute(); i++) {
        minutes.push(i);
      }
      return minutes;
    }
    return [];
  }}
  disabledSeconds={(selectedHour, selectedMinute) => {
    if (selectedHour === moment().hour() && selectedMinute === moment().minute()) {
      const seconds = [];
      for (let i = 0; i < moment().second(); i++) {
        seconds.push(i);
      }
      return seconds;
    }
    return [];
  }}
/>

            </Form.Item>
            <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="selectedVehicleId"
        label="Selected Vehicle"
        rules={[{ required: true, message: 'Please select a vehicle' }]}
        style={{ display: 'none' }}
      >
        <input value={selectedVehicle ? selectedVehicle.id : ''} />
      </Form.Item>

            {tripType === 'roundTrip' && (
              <>
                <Form.Item
                  name="returnAddress"
                  label="Return Address"
                  rules={[{ required: true, message: 'Please enter the return address' }]}
                >
                    <AutoComplete
                  placeholder="Enter the return address"
                  options={pickupOptions}
                  onChange={handlePickupInputChange}
                />
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
                      return current && current < pickupDate;
                    }}
                    className='select-form'/>
                </Form.Item>
                <Form.Item
                  name="returnTime"
                  label="Return Time"
                  rules={[{ required: true, message: 'Please select the return time' }]}
                >
                  <TimePicker
  style={{ width: '100%' }}
  className='select-form'
  disabledHours={() => {
    const hours = [];
    for (let i = 0; i < moment().hour(); i++) {
      hours.push(i);
    }
    return hours;
  }}
  disabledMinutes={(selectedHour) => {
    if (selectedHour === moment().hour()) {
      const minutes = [];
      for (let i = 0; i < moment().minute(); i++) {
        minutes.push(i);
      }
      return minutes;
    }
    return [];
  }}
  disabledSeconds={(selectedHour, selectedMinute) => {
    if (selectedHour === moment().hour() && selectedMinute === moment().minute()) {
      const seconds = [];
      for (let i = 0; i < moment().second(); i++) {
        seconds.push(i);
      }
      return seconds;
    }
    return [];
  }}
/>



                </Form.Item>
                <Form.Item
        name="chooseCar"
        label="Choose Car"
        rules={[{ required: true, message: 'Please select a car' }]}
      >
        <Radio.Group onChange={handleChooseCar}>
          <Radio value="chooseCar">Choose Car</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        name="selectedVehicleId"
        label="Selected Vehicle"
        rules={[{ required: true, message: 'Please select a vehicle' }]}
        style={{ display: 'none' }}
      >
        <input value={selectedVehicle ? selectedVehicle.id : ''} />
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
              <Input placeholder="Enter the guest name" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="guestEmail"
              label="Guest Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter the guest email" className='select-form'/>
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

  const renderHourlyCharterForm = () => {
    switch (currentStep) {
      case 0:
        return (
          <Form layout="vertical" onFinish={handleNext} id='hourlyForm'>

<Form.Item
        name="pickupAddress"
        label="Pickup Address"
        rules={[{ required: true, message: 'Please enter the pickup address' }]}
      >
        <AutoComplete
    placeholder="Enter the pickup address"
    options={pickupOptions}
    onChange={handlePickupInputChange}
  />
      </Form.Item>

      <Form.Item
        name="selectedVehicleId"
        label="Selected Vehicle"
        rules={[{ required: true, message: 'Please select a vehicle' }]}
        style={{ display: 'none' }}
      >
        <input value={selectedVehicle ? selectedVehicle.id : ''} />
      </Form.Item>



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
              <Input placeholder="Enter the guest name" className='select-form'/>
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
              <p><strong>Charter Hours:</strong> {bookingData.charterHours}</p>
              <p><strong>Pickup Address:</strong> {bookingData.pickupAddress}</p>

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
  const renderVehicles = () => {
    if (!radioSelected || vehicles.length === 0) {
      return null;
    }

    return (
      <div className='vehicle-list-cont'>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }} className='selectedCar'>
        {vehicles.map(vehicle => (
          <Col key={vehicle._id} xs={24} sm={12} md={8}>
            <Card
              className={`vehicle-card ${selectedVehicle && selectedVehicle._id === vehicle._id ? 'selected' : ''}`}
              cover={<img alt={vehicle.vehicleName} src={`http://localhost:5000/${vehicle.image}`} className='selectedCarImage'/>}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              <Card.Meta title={vehicle.vehicleName} description={`Passengers: ${vehicle.numberOfPassengers}, Price: ${vehicle.price}` } />
            </Card>
          </Col>
        ))}
      </Row>
      </div>
    );
  };




  return (
    <section id="service" ref={ref}>
      <div className='service-sliders'>
        <ServiceSlider />
      </div>
      <div className="about-content">
        <div className="nine">
          <h1>Our Services<span>Explore our services</span></h1>
        </div>
        <Row gutter={[16, 16]} className="about-section">
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="about-card">
              <Title level={4} className="about-card-title">Airport Service</Title>
              <Paragraph>
                Pre-booked rides to and from the airport for peace of mind.
              </Paragraph>
              <Button type="primary" onClick={() => handleBookNow('Airport Service')} className='book-btn'>Book Now</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="about-card">
              <Title level={4} className="about-card-title">
                Point to Point Service</Title>
              <Paragraph>
                Non-airport service from your door to theirs. Anytime, anywhere.
              </Paragraph>
              <Button type="primary" onClick={() => handleBookNow('Point to Point Service')}className='book-btn'>Book Now</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="about-card">
              <Title level={4} className="about-card-title">Hourly Charter</Title>
              <Paragraph>
                At your service, for as long as you need. Available locally.
              </Paragraph>
              <Button type="primary" onClick={() => handleBookNow('Hourly Charter')}className='book-btn'>Book Now</Button>
            </Card>
          </Col>
        </Row>
        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={toggleModal}>&times;</span>
              {isLoginForm ? (
                <div className="form-container">
                  <h2>Login</h2>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    <label htmlFor="password">Password:</label>
                    <div className="password-container">
                      <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button type="submit">Login</button>
                  </form>
                  <p>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchForm(); }}>Register</a></p>
                </div>
              ) : (
                <div className="form-container">
                  <h2>Register</h2>
                  <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username:</label>
                    <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} required />
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                    <label htmlFor="password">Password:</label>
                    <div className="password-container">
                      <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <button type="submit">Register</button>
                  </form>
                  <p>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); switchForm(); }}>Login</a></p>
                </div>
              )}
            </div>
          </div>
        )}

        <Drawer
          title={`Book ${serviceType}`}
          width={800}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          className="custom-drawer"
        >
          <div className='step-form-container'>
            <div className="steps-sidebar">
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
            <div className="form-content">
              {serviceType === 'Airport Service' && renderAirportServiceForm()}
              {serviceType === 'Point to Point Service' && renderPointToPointServiceForm()}
              {serviceType === 'Hourly Charter' && renderHourlyCharterForm()}

            </div>



          </div>
          {/* {renderBookingForm()} */}
          {renderVehicles()}
        </Drawer>
      </div>
    </section>
  );
});

export default Service;
