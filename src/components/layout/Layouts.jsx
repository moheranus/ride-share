import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  BellOutlined,
  DashboardFilled,
  MessageFilled,
  BookOutlined,
  SubnodeOutlined,
  CarOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, Dropdown, Avatar, Badge, notification, theme } from 'antd';
import './Layout.css';
import { useAuth } from '../../authcontext/AuthContext';
import AdminDashboard from '../adminDashboard/AdminDashboard';
import AdminBooking from '../adminDashboard/ViewBooking';
import ServiceManagement from '../adminDashboard/ServiceManagement';
import AdminMessages from '../adminDashboard/AdminMessages';
import VehicleAndRoute from '../adminDashboard/VehicleAndRoute';

const { Header, Sider, Content } = Layout;

function Layouts({ children }) {
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('1');
  const [notifications, setNotifications] = useState([]);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    setSelectedMenuItem('1');
    const POLL_INTERVAL = 5000; // Adjust the interval as needed

    const fetchNewBookings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bookings/new');
        if (response.ok) {
          const newBookings = await response.json();
          if (newBookings.length > 0) {
            newBookings.forEach((booking) => {
              notification.info({
                message: 'New Booking',
                description: `New booking from ${booking.guestDetails.name}`,
              });
            });
            setNotifications((prevNotifications) => [
              ...prevNotifications,
              ...newBookings.map((booking) => ({
                key: booking._id,
                booking,
              })),
            ]);
          }
        } else {
          console.error('Error fetching new bookings:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching new bookings:', error);
      }
    };

    const intervalId = setInterval(fetchNewBookings, POLL_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
    setSelectedBookingId(null); // Reset selected booking when menu item changes
  };

  const handleNotificationClick = (bookingId) => {
    setSelectedMenuItem('4');
    setSelectedBookingId(bookingId);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.booking._id !== bookingId)
    );
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case '1':
        return <AdminDashboard />;
      // case '2':
      //   return <ServiceManagement />;
      case '3':
        return <AdminMessages/>;
      case '4':
        return <AdminBooking bookingId={selectedBookingId} onResetNotification={handleNotificationClick} />;
      case '5':
        return <VehicleAndRoute />;
      default:
        return <div>Select a menu item</div>;
    }
  };

  const notificationMenu = (
    <Menu>
      {notifications.length > 0 ? (
        notifications.map((notification) => (
          <Menu.Item key={notification.key} onClick={() => handleNotificationClick(notification.booking._id)}>
            {notification.booking.guestDetails.name} - {notification.booking.serviceType}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item>No new notifications</Menu.Item>
      )}
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="3" onClick={logout}>Logout</Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} className='sidebar'>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenuItem]}
          onClick={handleMenuClick}
          className='menu-item'
        >
          <Menu.Item key="1" icon={<DashboardFilled />}>
            Dashboard
          </Menu.Item>
          {/* <Menu.Item key="2" icon={<SubnodeOutlined />}>
            Add Service
          </Menu.Item> */}
          <Menu.Item key="3" icon={<MessageFilled />}>
            Messages
          </Menu.Item>
          <Menu.Item key="4" icon={<BookOutlined />}>
            View Bookings
          </Menu.Item>
          <Menu.Item key="5" icon={<CarOutlined />}>
          Add Vehicle
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className='header-layout'
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined className='menu-btn' /> : <MenuFoldOutlined className='menu-btn' />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
              className='menu-button'
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '16px' }} className='header-menus'>
              <Dropdown overlay={notificationMenu} trigger={['click']}>
                <Badge count={notifications.length}>
                  <BellOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
                </Badge>
              </Dropdown>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              </Dropdown>
            </div>
          </div>
        </Header>
        <Content
          className='content-layout'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Layouts;
