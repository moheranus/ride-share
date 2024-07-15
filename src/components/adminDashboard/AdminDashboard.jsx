import React, { useState } from 'react';
import { Menu} from 'antd';
import DashboardContent from './DashboardContent';
import UserManagement from './UserManagement';
import "./AdminDashboard.css";

function AdminDashboard() {
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e.key);
  };

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'dashboard':
        return <DashboardContent />;
      case 'userManagement':
        return <UserManagement />;
      // Add more cases for other components
      default:
        return <DashboardContent />;
    }
  };

  
  return (
    <div style={{ padding: 24, minHeight: '100vh', marginTop:'-50px'}}>
      <div style={{ marginBottom: 24 }}>
        
      </div>
      <Menu mode="horizontal" onClick={handleMenuClick} defaultSelectedKeys={['dashboard']}>
        <Menu.Item key="dashboard">Dashboard</Menu.Item>
        <Menu.Item key="userManagement">User Management</Menu.Item>
        {/* Add more menu items here */}
      </Menu>
      <div style={{ marginTop: 24 }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminDashboard;
