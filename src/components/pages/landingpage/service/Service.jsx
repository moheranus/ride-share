import React, { useState, useEffect } from 'react';
import { stringify } from 'flatted';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Card, Button, message, Drawer, Form, Input, DatePicker, TimePicker,Select, AutoComplete, Radio } from 'antd';
import { useAuth } from '../../../../authcontext/AuthContext';
import { BsAirplaneEnginesFill } from "react-icons/bs";
import { IoMdClock } from "react-icons/io";
import { TbTransformPointBottomLeft } from "react-icons/tb";

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
  const [bookingData, setBookingData] = useState({
    tripType: '',
    airportName: '',
    hotelName: '',
    pickupDate: '',
    pickupTime: '',
    chooseCar: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    pickupAddress: '',
    dropoffAddress: '',
    serviceType: '',
    image: '',
    numberOfPassengers: 0
});
  // const [numberOfPassengers, setNumberOfPassengers] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [radioSelected, setRadioSelected] = useState(false);
  const [pickupOptions, setPickupOptions] = useState([]);
  const [dropOffOptions, setDropOffOptions] = useState([]);
  const [routes, setRoutes] = useState([]);
 const [airports, setAirports] = useState([]);
 const [hotels, setHotels] = useState([]);
  const [hotelOptions, setHotelOptions] = useState([]);
 const [airportOptions, setAirportOptions] = useState([]);

 const fetchHotels = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/hotels');
      return res.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return []; // Return an empty array or handle the error as needed
    }
 }
  const fetchRoutes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/routes');
      return res.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching routes:', error);
      return []; // Return an empty array or handle the error as needed
    }
  };
 const  fetchAirports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/airports');
      return res.data; // Return the fetched data
    } catch (error) {
      console.error('Error fetching airports:', error);
      return []; // Return an empty array or handle the error as needed
    }


  }
  useEffect(() => {
    const fetchAirportsAndSetState = async () => {
      try {
        const airportsData = await fetchAirports();
        setAirports(airportsData); // Set the airports state
        // Optionally, update pickupOptions and dropOffOptions here if needed
      } catch (error) {
        console.error('Error setting airports state:', error);
      }
    };

    fetchAirportsAndSetState();

  }, []);

  useEffect(() => {
    const fetchHotelsAndSetState = async () => {
      try {
        const hotelsData = await fetchHotels();
        setHotels(hotelsData); // Set the hotels state
        // Optionally, update pickupOptions and dropOffOptions here if needed
      } catch (error) {
        console.error('Error setting hotels state:', error);
      }
    };

    fetchHotelsAndSetState();
  }, []);

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

const handleAirportInputChange = async (value) => {
    if (!value) {
      setAirportOptions([]);
      return;
    }

    try {
      const results = await fetchAirports();
      const filteredOptions = results.filter(airport =>
        airport.airportName.toLowerCase().startsWith(value.toLowerCase())
      );
      setAirportOptions(filteredOptions.map(airport => ({ value: airport.airportName })));
    } catch (error) {
      console.error('Error handling airport input change:', error);
    }


}
 const handleHotelInputChange = async (value) => {
    if (!value) {
      setHotelOptions([]);
      return;
    }

    try {
      const results = await fetchHotels();
      const filteredOptions = results.filter(hotel =>
        hotel.hotelName.toLowerCase().startsWith(value.toLowerCase())
      );
      setHotelOptions(filteredOptions.map(hotel => ({ value: hotel.hotelName })));
    } catch (error) {
      console.error('Error handling hotel input change:', error);
    }

 }


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
    setBookingData({ ...bookingData, ...values, serviceType: serviceType });
    setCurrentStep(currentStep + 1);
  };


  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleBookingSubmit = async () => {
    try {
        const bookingPayload = {
            tripType: bookingData.tripType,
            airportName: bookingData.airportName,
            hotelName: bookingData.hotelName,
            pickupDate: bookingData.pickupDate,
            pickupTime: bookingData.pickupTime,
            chooseCar: bookingData.chooseCar,
            pickupAddress: bookingData.pickupAddress,
            dropoffAddress: bookingData.dropoffAddress,
            image: selectedVehicle?.image,
            guestDetails: {
                name: bookingData.name,
                email: bookingData.email,
                phone: bookingData.phone,
                address: bookingData.address
            },
            serviceType: bookingData.serviceType,

            vehicleId: selectedVehicle?._id,
            vehicleName: selectedVehicle?.vehicleName,
            totalPrice: selectedVehicle?.price,
            numberOfPassengers: selectedVehicle?.numberOfPassengers
        };

        // Log the bookingPayload to inspect it
        console.log('Booking Payload:', bookingPayload);

        const response = await axios.post('http://localhost:5000/api/bookings', bookingPayload);
        message.success('Booking successful');
        setDrawerVisible(false);
        console.log('Booking response:', response.data);
    } catch (error) {
        console.error('Error submitting booking:', error);
        message.error('Booking failed');
    }
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
                <option value="">Select trip type</option>
                <option value="oneWay">One Way</option>
                <option value="roundTrip">Round Trip</option>
              </select>
            </Form.Item>
            <Form.Item
              name="airportName"
              label="Airport Name"
              rules={[{ required: true, message: 'Please select Airport' }]}
            >
                  <AutoComplete
                placeholder="Select Airport"
                options={airportOptions}
                onChange={handleAirportInputChange}
              />
            </Form.Item>
            <Form.Item
              name="hotelName"
              label="Hotel/Residence /other"
              rules={[{ required: true, message: 'Please select hotel/residence' }]}
            >
                  <AutoComplete
                placeholder="Select hotel/residence"
                options={hotelOptions}
                onChange={handleHotelInputChange}
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
      {renderVehicles()}
            {tripType === 'roundTrip' && (
              <>



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
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter the guest name' }]}
            >
              <Input placeholder="Enter the guest name" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="email"
              label="Guest Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter the guest email" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter a valid phone number' }]}
            >
              <Input placeholder="Enter the phone number" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true, message: 'Please enter the address' }]}
            >
              <Input placeholder="Enter the address" className='select-form'/>
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
              <p><strong>Airport Name:</strong> {bookingData.airportName}</p>
              <p><strong>Hotel Name:</strong> {bookingData.hotelName}</p>
              <p><strong>Pickup Date:</strong> {bookingData.pickupDate?.format('YYYY-MM-DD')}</p>
              <p><strong>Pickup Time:</strong> {bookingData.pickupTime?.format('HH:mm')}</p>
              {tripType === 'roundTrip' && (
                <>

                </>
              )}
              <p><strong>Guest Name:</strong> {bookingData.name}</p>
              <p><strong>Guest Email:</strong> {bookingData.email}</p>
              <p><strong>Phone Number:</strong> {bookingData.phone}</p>
              <p><strong>Address:</strong> {bookingData.address}</p>
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
                <option value="">Select trip type</option>
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
              name="dropoffAddress"
              label="drop Off Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter drop off address"
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
      {renderVehicles()}
            {tripType === 'roundTrip' && (
              <>


                <Form.Item
                  name="returnPickupDate"
                  label="Return Pickup Date"
                  rules={[{ required: true, message: 'Please select return pickup date' }]}
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
                  name="returnPickupTime"
                  label="Return Pickup Time"
                  rules={[{ required: true, message: 'Please select Return pickup time' }]}
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




     <div>

     </div>


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
              name="name"
              label="Guest Name"
              rules={[{ required: true, message: 'Please enter the guest name' }]}
            >
              <Input placeholder="Enter the guest name" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="email"
              label="Guest Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter the guest email" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Guest Phone"
              rules={[{ required: true, message: 'Please enter a valid phone number' }]}
            >
              <Input placeholder="Enter the guest phone number" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="address"
              label="Guest Address"
              rules={[{ required: true, message: 'Please enter the guest address' }]}
            >
              <Input placeholder="Enter the guest address" className='select-form'/>
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

                  <p><strong>Return Date:</strong> {bookingData.returnPickupDate?.format('YYYY-MM-DD')}</p>
                  <p><strong>Return Time:</strong> {bookingData.returnPickTime?.format('HH:mm')}</p>
                </>
              )}
              <p><strong>Guest Name:</strong> {bookingData.name}</p>
              <p><strong>Guest Email:</strong> {bookingData.email}</p>
              <p><strong>Guest Phone:</strong> {bookingData.phone}</p>
              <p><strong>Guest Address:</strong> {bookingData.address}</p>

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
              name="dropoffAddress"
              label="drop Off Address"
              rules={[{ required: true, message: 'Please enter the pickup address' }]}
            >
                  <AutoComplete
                placeholder="Enter drop off address"
                options={pickupOptions}
                onChange={handlePickupInputChange}
              />
            </Form.Item>
            <Form.Item
              name="hour"
              label="Select Hour"
              rules={[{ required: true, message: 'Please select hour' }]}
            >
              <select onChange={(e) => setTripType(e.target.value)} value={tripType} className='select-form'>
                <option value="">Select hour</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
                <option value="20">20</option>

              </select>
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
      {renderVehicles()}
            {tripType === 'roundTrip' && (
             <>


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
              name="name"
              label="Guest Name"
              rules={[{ required: true, message: 'Please enter the guest name' }]}
            >
              <Input placeholder="Enter the guest name" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="email"
              label="Guest Email"
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
            >
              <Input placeholder="Enter the guest email" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="phone"
              label="Guest Phone"
              rules={[{ required: true, message: 'Please enter a valid phone number' }]}
            >
              <Input placeholder="Enter the guest phone number" className='select-form'/>
            </Form.Item>
            <Form.Item
              name="address"
              label="Guest Address"
              rules={[{ required: true, message: 'Please enter the guest address' }]}
            >
              <Input placeholder="Enter the guest address" className='select-form'/>
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

              <p><strong>Pickup Address:</strong> {bookingData.pickupAddress}</p>
              <p><strong>Pickup Date:</strong> {bookingData.pickupDate?.format('YYYY-MM-DD')}</p>
              <p><strong>Pickup Time:</strong> {bookingData.pickupTime?.format('HH:mm')}</p>
              <p><strong>Hour:</strong>{bookingData.hour}</p>

              <p><strong>Guest Name:</strong> {bookingData.name}</p>
              <p><strong>Guest Email:</strong> {bookingData.email}</p>
              <p><strong>Guest Phone:</strong> {bookingData.phone}</p>
              <p><strong>Guest Address:</strong> {bookingData.address}</p>
              <p><strong>Selected car:</strong>{bookingData.vehicleName}</p>

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
              <Title level={4} className="about-card-title">
              <div className='service-icon'>
                < BsAirplaneEnginesFill className="service-icons"/>
                </div>
                Airport Service</Title>
              <Paragraph>
                Pre-booked rides to and from the airport for peace of mind.
              </Paragraph>
              <Button type="primary" onClick={() => handleBookNow('Airport Service')} className='book-btn'>Book Now</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="about-card">
              <Title level={4} className="about-card-title">
                <div className='service-icon'>
                <TbTransformPointBottomLeft className="service-icons"/>
                </div>
                Point to Point Service</Title>
              <Paragraph>
                Non-airport service from your door to theirs. Anytime, anywhere.
              </Paragraph>
              <Button type="primary" onClick={() => handleBookNow('Point to Point Service')}className='book-btn'>Book Now</Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card bordered={false} className="about-card">
              <Title level={4} className="about-card-title">
              <div className='service-icon'>
                <IoMdClock className="service-icons"/>
                </div>
                Hourly Charter</Title>
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

        </Drawer>
      </div>
    </section>
  );
});

export default Service;
