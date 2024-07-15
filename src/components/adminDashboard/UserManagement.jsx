import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, notification, Popconfirm, Spin } from 'antd';
import axios from 'axios';

const { Search } = Input;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      notification.error({ message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/role', { userId, role });
      setUsers((prevUsers) => prevUsers.map(user => user._id === userId ? response.data : user));
      setFilteredUsers((prevUsers) => prevUsers.map(user => user._id === userId ? response.data : user));
      notification.success({ message: 'User role updated successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to update user role' });
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
      setFilteredUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
      notification.success({ message: 'User deleted successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to delete user' });
    }
  };

  const handleSearch = (value) => {
    const filteredData = users.filter(user =>
      user.username.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.role.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filteredData);
  };

  const columns = [
    {
      title: 'User ID',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role, record) => (
        <Space size="middle">
          <span>{role}</span>
          <Button onClick={() => updateUserRole(record._id, role === 'admin' ? 'user' : 'admin')}>
            {role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
          </Button>
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Popconfirm
            title="Are you sure you want to delete this user?"
            onConfirm={() => deleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>User Management</h2>
      <Search
        placeholder="Search users"
        onSearch={handleSearch}
        enterButton
        style={{ marginBottom: '20px' }}
      />
      {loading ? (
        <Spin tip="Loading..." style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }} />
      ) : (
        <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />
      )}
    </div>
  );
};

export default UserManagement;
