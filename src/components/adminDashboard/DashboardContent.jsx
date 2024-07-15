import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Spin, DatePicker } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;

const DashboardContent = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalVehicles: 0,
    chartData: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([moment().startOf('month'), moment().endOf('month')]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (dashboardData.chartData.length > 0) {
      filterDataByDate();
    }
  }, [dateRange, dashboardData.chartData]);

  const fetchDashboardData = async () => {
    try {
      const [usersResponse, bookingsResponse, vehiclesResponse] = await Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/bookings'),
        axios.get('http://localhost:5000/api/vehicles')
      ]);

      const users = usersResponse.data;
      const bookings = bookingsResponse.data;
      const vehicles = vehiclesResponse.data;

      const totalUsers = users.length;
      const totalBookings = bookings.length;
      const totalVehicles = vehicles.length;


      setDashboardData({
        totalUsers,
        totalBookings,
        totalVehicles,
        chartData: bookings
      });
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
      setLoading(false);
    }
  };

  const filterDataByDate = () => {
    const [startDate, endDate] = dateRange;
    const filteredData = dashboardData.chartData.filter(booking => {
      const bookingDate = moment(booking.date);
      return bookingDate.isBetween(startDate, endDate, 'days', '[]');
    });

    const monthlyData = {};
    filteredData.forEach(booking => {
      const month = moment(booking.date).format('MMM');
      if (!monthlyData[month]) {
        monthlyData[month] = { bookings: 0 };
      }
      monthlyData[month].bookings += 1;
    });

    const chartData = Object.keys(monthlyData).map(month => ({
      name: month,
      bookings: monthlyData[month].bookings,
      totalBookings: dashboardData.totalBookings,
      totalUsers: dashboardData.totalUsers,
      totalVehicles: dashboardData.totalVehicles,
    }));

    setDashboardData(prevData => ({ ...prevData, chartData }));
  };

  const handleDateChange = (dates) => {
    setDateRange(dates);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Users" bordered={false}>
            {dashboardData.totalUsers}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Bookings" bordered={false}>
            {dashboardData.totalBookings}
          </Card>
        </Col>
        <Col span={8}>
          <Card title="Total Vehicles" bordered={false}>
            {dashboardData.totalVehicles}
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Monthly Statistics" bordered={false}>
            <RangePicker
              defaultValue={dateRange}
              onChange={handleDateChange}
              style={{ marginBottom: 16 }}
            />
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="totalBookings" stroke="#8884d8" activeDot={{ r: 8 }} name="Bookings" />
                <Line type="monotone" dataKey="totalUsers" stroke="#82ca9d" activeDot={{ r: 8 }} name="Total Users" />
                <Line type="monotone" dataKey="totalVehicles" stroke="#ffc658" activeDot={{ r: 8 }} name="Total Vehicles" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardContent;
