import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, Form, Input, Space, Popconfirm, notification } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import "./serviceManagement.css";

const { Content } = Layout;

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setCurrentService(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (service) => {
    setIsEditMode(true);
    setCurrentService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleDelete = async (serviceId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        notification.success({
          message: 'Service Deleted',
          description: 'The service has been deleted successfully.',
        });
        fetchServices();
      } else {
        throw new Error('Failed to delete service');
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete the service.',
      });
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const method = isEditMode ? 'PUT' : 'POST';
      const url = isEditMode
        ? `http://localhost:5000/api/services/${currentService._id}`
        : 'http://localhost:5000/api/services';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        notification.success({
          message: `Service ${isEditMode ? 'Updated' : 'Added'}`,
          description: `The service has been ${isEditMode ? 'updated' : 'added'} successfully.`,
        });
        fetchServices();
        setIsModalVisible(false);
      } else {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'add'} service`);
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} service:`, error);
      notification.error({
        message: 'Error',
        description: `Failed to ${isEditMode ? 'update' : 'add'} the service.`,
      });
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: 'Service Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="service-management">
      <Content style={{ padding: '24px', minHeight: 280 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: '20px' }}>
          Add Service
        </Button>
        <Table
          columns={columns}
          dataSource={services}
          rowKey="_id"
          loading={loading}

        />
        <Modal
          title={`${isEditMode ? 'Edit' : 'Add'} Service`}
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText={isEditMode ? 'Update' : 'Add'}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Service Name"
              rules={[{ required: true, message: 'Please input the service name!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please input the service description!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please input the service price!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </div>
  );
};

export default ServiceManagement;
