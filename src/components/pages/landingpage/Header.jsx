import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../authcontext/AuthContext';
import { useNavigate } from 'react-router-dom';
import { message, Badge, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import './Header.css';

function Header({ scrollToSection, activeSection }) {
  const { login, register, isAuthenticated, userRole, logout, username } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleModal = () => {
    setShowModal(!showModal);
    setIsOpen(false);
  };
  const switchForm = () => setIsLoginForm(!isLoginForm);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginForm) {
      try {
        const { username, role } = await login(formData.username, formData.password);
        message.success(`Logged in as: ${username}`);
        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
        setShowModal(false);
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

  const getNavClass = (section) => (activeSection === section ? 'nav-link active' : 'nav-link');

  useEffect(() => {
    if (isAuthenticated && username) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 60000); // Poll every minute
      return () => clearInterval(intervalId);
    }
  }, [isAuthenticated, username]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${username}`);
      const data = await response.json();
      console.log('Fetched notifications:', data); // Debug log
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleNotificationClick = () => {
    notification.open({
      message: 'Notifications',
      description: notifications.map((notif, index) => (
        <div key={index}>{notif.message}</div>
      )),
    });
    setNotifications([]);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">johnwayneShuttle</div>
        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </div>
        <nav className={isOpen ? 'nav-open' : ''}>
          <ul className="nav-links">
            <li>
              <a href="#home" className={getNavClass('home')} onClick={(e) => { e.preventDefault(); scrollToSection('home'); toggleMenu(); }}>HOME</a>
            </li>
            <li>
              <a href="#service" className={getNavClass('service')} onClick={(e) => { e.preventDefault(); scrollToSection('service'); toggleMenu(); }}>SERVICE</a>
            </li>
            <li>
              <a href="#featured-cars" className={getNavClass('featuredCars')} onClick={(e) => { e.preventDefault(); scrollToSection('featuredCars'); toggleMenu(); }}>ABOUT</a>
            </li>
            <li>
              <a href="#contact" className={getNavClass('contact')} onClick={(e) => { e.preventDefault(); scrollToSection('contact'); toggleMenu(); }}>CONTACT</a>
            </li>
            {isAuthenticated && (
              <li>
                <Badge count={notifications.length} onClick={handleNotificationClick}>
                  <BellOutlined style={{ fontSize: '24px', color: '#fff' }} />
                </Badge>
              </li>
            )}
            {isAuthenticated ? (
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className='login-logout'>LOGOUT</a>
              </li>
            ) : (
              <li>
                <a href="#" onClick={(e) => { e.preventDefault(); toggleModal(); }} className='login-logout'>LOGIN</a>
              </li>
            )}
          </ul>
        </nav>
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
    </header>
  );
}

export default Header;
