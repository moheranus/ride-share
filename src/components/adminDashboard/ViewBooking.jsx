import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, notification, Space, Tag, Input } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, SearchOutlined } from '@ant-design/icons';
import "./viewBooking.css";

const { Content } = Layout;

const AdminBooking = ({ bookingId, onResetNotification }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [hasOpenedFromNotification, setHasOpenedFromNotification] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookingId && !hasOpenedFromNotification) {
      const booking = bookings.find(b => b._id === bookingId);
      if (booking) {
        setSelectedBooking(booking);
        setIsModalVisible(true);
        setHasOpenedFromNotification(true);
        onResetNotification(bookingId);
      }
    }
  }, [bookingId, bookings, hasOpenedFromNotification, onResetNotification]);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter(booking =>
        booking.pickupAddress.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.dropoffAddress.toLowerCase().includes(searchText.toLowerCase()) ||
        booking.guestDetails.name.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [searchText, bookings]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bookings');
      const data = await response.json();
      console.log('Fetched bookings:', data);
      data.reverse();
      setBookings(data);
      setFilteredBookings(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      setLoading(false);
    }
  };

  const handleViewDetails = (record) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const handleApprove = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${record._id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        notification.success({
          message: 'Booking Approved',
          description: 'The booking has been approved successfully.',
        });
        const updatedBookings = bookings.map(booking =>
          booking._id === record._id ? { ...booking, status: 'approved' } : booking
        );
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to approve booking: ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to approve booking:', error);
      notification.error({
        message: 'Error',
        description: `Failed to approve the booking: ${error.message}`,
      });
    }
  };

  const handleReject = async (record) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${record._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        notification.success({
          message: 'Booking Rejected',
          description: 'The booking has been rejected successfully.',
        });
        const updatedBookings = bookings.map(booking =>
          booking._id === record._id ? { ...booking, status: 'rejected' } : booking
        );
        setBookings(updatedBookings);
        setFilteredBookings(updatedBookings);
      } else {
        const errorText = await response.text();
        throw new Error(`Failed to reject booking: ${errorText}`);
      }
    } catch (error) {
      console.error('Failed to reject booking:', error);
      notification.error({
        message: 'Error',
        description: `Failed to reject the booking: ${error.message}`,
      });
    }
  };

  const columns = [
    {
      title: 'Service Type',
      dataIndex: 'serviceType',
      key: 'serviceType',
    },

    {
      title: 'selected vehicle',
      dataIndex: 'image',
      key: 'image',
      render: (text, record) => (
        record.image ? (
          <img
            src={`http://localhost:5000/${record.image.replace("\\", "/")}`}
            alt="Vehicle"
            style={{ width: '100px', height: 'auto' }}
            onError={(e) => { e.target.onerror = null; e.target.src = 'fallback_image_url'; }}
          />
        ) : 'No Image'
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text, record) => (
        <Tag color={record.status === 'approved' ? 'green' : record.status === 'rejected' ? 'red' : 'orange'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>View</Button>
          {record.status === 'pending' && (
            <>
              <Button type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>Approve</Button>
              <Button type="danger" icon={<CloseOutlined />} onClick={() => handleReject(record)}>Reject</Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="admin-booking">
      <Content style={{ padding: '24px', minHeight: 280 }}>
        <Input
          placeholder="Search bookings"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          prefix={<SearchOutlined />}
          style={{ marginBottom: '20px' }}
        />
        <Table
          columns={columns}
          dataSource={filteredBookings}
          rowKey="_id"
          loading={loading}
          pagination={{ current: currentPage, pageSize: pageSize }}
          onChange={handleTableChange}
          rowClassName={(record) => record.status === 'pending' ? 'highlight-row' : ''}
        />
        <Modal
          title="Booking Details"
          visible={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          {selectedBooking && (
            <div className='bookingInfoModalCont'>
              <div className='leftModalCont'>
              <p><strong>Pick-up Address:</strong> {selectedBooking.pickupAddress}</p>
              <p><strong>Drop Off Address:</strong> {selectedBooking.dropoffAddress}</p>
              <p><strong>Service Type:</strong> {selectedBooking.serviceType}</p>
              <p><strong>Status:</strong> {selectedBooking.status}</p>
              <p><strong>Guest Name:</strong> {selectedBooking.guestDetails.name}</p>
              <p><strong>Guest Email:</strong> {selectedBooking.guestDetails.email}</p>
              <p><strong>Guest Phone:</strong> {selectedBooking.guestDetails.phone}</p>
              <p><strong>Guest Address:</strong> {selectedBooking.guestDetails.address}</p>
              </div>
              <div className='rightModalCont'>
              <p><strong>Trip Type:</strong> {selectedBooking.tripType}</p>
              <p><strong>Airport Name:</strong> {selectedBooking.airportName}</p>
              <p><strong>Hotel Name:</strong> {selectedBooking.hotelName}</p>
              <p><strong>Choose Car:</strong> {selectedBooking.chooseCar}</p>
              <p><strong>Number of Passengers:</strong> {selectedBooking.numberOfPassengers}</p>
              <p><strong>Total Price:</strong> {selectedBooking.totalPrice}</p>
              </div>



            </div>
          )}
        </Modal>
      </Content>
    </div>
  );
};

export default AdminBooking;
