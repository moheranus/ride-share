import React, { useState } from 'react';
import './Home.css';
import gmc1 from '../../../../assets/images/gmc1.png';
import { useAuth } from '../../../../authcontext/AuthContext';
import { message } from 'antd';

const Home = React.forwardRef(({ scrollToServiceSection }, ref) => {
  const { login, register, isAuthenticated, userRole, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

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
        if (role === 'admin') {
          // Navigate to admin dashboard
        } else {
          // Navigate to user dashboard
        }
        setShowModal(false); // Close the modal after successful login
      } catch (error) {
        console.error(error);
        message.error('Login failed');
      }
    } else {
      try {
        await register(formData.username, formData.email, formData.password);
        message.success('Registration successful');
        setShowModal(false);
        setIsLoginForm(true);
      } catch (error) {
        console.error(error);
        message.error('Registration failed');
      }
    }
  };

  const handleBookNow = () => {
    scrollToServiceSection();
  };

  return (
    <section id="home" ref={ref} className="home-container">
      <div className='home-sect'>
        <div className='home-sect-left'>
          <div className='home-sect-left-text'>
            <h2 className='header-two'>FIND AND BOOK THE BEST <span>CARS </span>EASILY</h2>
            <p>Want to book a car for camping, City riding or Airport? Book the best cars from Us to get the best experience</p>

            <div className='home-sect-left-btn'>
              <button className="online-booking" onClick={handleBookNow}>
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow"></span>
                </span>
                <span className="button-text">Online Booking</span>
              </button>
            </div>
          </div>
        </div>
        <div className='home-sect-right'>
          <div className='home-sect-right-img'>
            <img src={gmc1} alt='car' />
          </div>
        </div>
      </div>

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
    </section>
  );
});

export default Home;
