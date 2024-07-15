import React, { useState, useEffect } from 'react';
import { Tabs, Form, Input, Button, InputNumber, Upload, message, Table, Popconfirm, Modal } from 'antd';
import { UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './vehicleRoute.css';

const { TabPane } = Tabs;

const VehicleAndRoute = () => {
  const [vehicles, setVehicles] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [hotels, setHotels] = useState([]);
  const[editingHotel, setEditingHotel] = useState(null);
  const [isHotelModalVisible, setIsHotelModalVisible] = useState(false);
  const [editingAirport, setEditingAirport] = useState(null);
  const [isAirportModalVisible, setIsAirportModalVisible] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editingRoute, setEditingRoute] = useState(null);
  const [isVehicleModalVisible, setIsVehicleModalVisible] = useState(false);
  const [isRouteModalVisible, setIsRouteModalVisible] = useState(false);
  const [vehicleForm] = Form.useForm();
  const [routeForm] = Form.useForm();
  const [airportForm] = Form.useForm();
  const [hotelForm] = Form.useForm();

  useEffect(() => {
    const fetchVehicles = async () => {
      const res = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(res.data);
    };
    const fetchRoutes = async () => {
      const res = await axios.get('http://localhost:5000/api/routes');
      setRoutes(res.data);
    };
    const fetchAirports = async () => {
      const res = await axios.get('http://localhost:5000/api/airports');
      setAirports(res.data);
    }
    const fetchHotels = async () => {
      const res = await axios.get('http://localhost:5000/api/hotels');
      setHotels(res.data);
    }
    fetchHotels();
    fetchAirports();
    fetchVehicles();
    fetchRoutes();
  }, []);

  const handleVehicleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('vehicleName', values.vehicleName);
      formData.append('numberOfPassengers', values.numberOfPassengers);
      formData.append('price', values.price);
      formData.append('image', values.image[0].originFileObj);

      const res = await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles([...vehicles, res.data]);
      message.success('Vehicle added successfully');
      vehicleForm.resetFields();  // Reset form fields
    } catch (error) {
      message.error('Failed to add vehicle');
    }
  };

  const handleRouteSubmit = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/routes', values);
      setRoutes([...routes, res.data]);
      message.success('Route added successfully');
      routeForm.resetFields();  // Reset form fields
    } catch (error) {
      message.error('Failed to add route');
    }
  };
  const handleAirportSubmit = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/airports', values);
      setAirports([...airports, res.data]);
      message.success('Airport added successfully');
      airportForm.resetFields();  // Reset form fields
    } catch (error) {
      message.error('Failed to add airport');
    }
  }
  const handleHotelSubmit = async (values) => {
    try {
      const res = await axios.post('http://localhost:5000/api/hotels', values);
      setHotels([...hotels, res.data]);
      message.success('Hotel added successfully');
      hotelForm.resetFields();  // Reset form fields
    } catch (error) {
      message.error('Failed to add hotel');
    }
  }
  const handleEditAirport = (record) => {
    setEditingAirport(record);
    setIsAirportModalVisible(true);
  }
  const handleEditHotel = (record) => {
    setEditingHotel(record);
    setIsHotelModalVisible(true);
  }
  const handleDeleteAirport = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/airports/${id}`);
      setAirports(airports.filter((airport) => airport._id !== id));
      message.success('Airport deleted successfully');
    } catch (error) {
      message.error('Failed to delete airport');
    }
  }
  const handleDeleteHotel = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel._id !== id));
      message.success('Hotel deleted successfully');
    } catch (error) {
      message.error('Failed to delete hotel');
    }
  }

  const handleEditVehicle = (record) => {
    const filename = record.image.split('/').pop();
    setEditingVehicle({
      ...record,
      image: [{
        uid: '-1',
        name: filename,
        status: 'done',
        url: `http://localhost:5000/${filename}`,
      }],
    });
    setIsVehicleModalVisible(true);
  };

  const handleEditRoute = (record) => {
    setEditingRoute(record);
    setIsRouteModalVisible(true);
  };

  const handleDeleteVehicle = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${id}`);
      setVehicles(vehicles.filter((vehicle) => vehicle._id !== id));
      message.success('Vehicle deleted successfully');
    } catch (error) {
      message.error('Failed to delete vehicle');
    }
  };

  const handleDeleteRoute = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/routes/${id}`);
      setRoutes(routes.filter((route) => route._id !== id));
      message.success('Route deleted successfully');
    } catch (error) {
      message.error('Failed to delete route');
    }
  };
const handleAirportUpdate = async (values) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/airports/${editingAirport._id}`, values);
      setAirports(airports.map((airport) => (airport._id === editingAirport._id ? res.data : airport)));
      message.success('Airport updated successfully');
      setIsAirportModalVisible(false);
    } catch (error) {
      message.error('Failed to update airport');
    }
}
  const handleVehicleUpdate = async (values) => {
    try {
      const formData = new FormData();
      formData.append('vehicleName', values.vehicleName);
      formData.append('numberOfPassengers', values.numberOfPassengers);
      formData.append('price', values.price);
      if (values.image) {
        formData.append('image', values.image[0].originFileObj);
      }

      const res = await axios.put(`http://localhost:5000/api/vehicles/${editingVehicle._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setVehicles(vehicles.map((vehicle) => (vehicle._id === editingVehicle._id ? res.data : vehicle)));
      message.success('Vehicle updated successfully');
      setIsVehicleModalVisible(false);
    } catch (error) {
      message.error('Failed to update vehicle');
    }
  };

  const handleRouteUpdate = async (values) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/routes/${editingRoute._id}`, values);
      setRoutes(routes.map((route) => (route._id === editingRoute._id ? res.data : route)));
      message.success('Route updated successfully');
      setIsRouteModalVisible(false);
    } catch (error) {
      message.error('Failed to update route');
    }
  };
  const handleHotelUpdate = async (values) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/hotels/${editingHotel._id}`, values);
      setHotels(hotels.map((hotel) => (hotel._id === editingHotel._id ? res.data : hotel)));
      message.success('Hotel updated successfully');
      setIsHotelModalVisible(false);
    } catch (error) {
      message.error('Failed to update hotel');
    }
  }

  const vehicleColumns = [
    {
      title: 'Vehicle Name',
      dataIndex: 'vehicleName',
      key: 'vehicleName',
    },
    {
      title: 'Number of Passengers',
      dataIndex: 'numberOfPassengers',
      key: 'numberOfPassengers',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (text) => {
        const imageUrl = `http://localhost:5000/${text}`;
        return <img src={imageUrl} alt="vehicle" style={{ width: '100px' }} />;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <EditOutlined onClick={() => handleEditVehicle(record)} style={{ marginRight: 16 }} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteVehicle(record._id)}>
            <DeleteOutlined />
          </Popconfirm>
        </>
      ),
    },
  ];

  const routeColumns = [
    {
      title: 'Route Name',
      dataIndex: 'routeName',
      key: 'routeName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <EditOutlined onClick={() => handleEditRoute(record)} style={{ marginRight: 16 }} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteRoute(record._id)}>
            <DeleteOutlined />
          </Popconfirm>
        </>
      ),
    },
  ];
  const airportColumns = [
    {
      title: 'Airport Name',
      dataIndex: 'airportName',
      key: 'airportName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <EditOutlined onClick={() => handleEditAirport(record)} style={{ marginRight: 16 }} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteAirport(record._id)}>
            <DeleteOutlined />
          </Popconfirm>
        </>
      ),
    },
  ];
  const hotelColumns = [
    {
      title: 'Hotel Name',
      dataIndex: 'hotelName',
      key: 'hotelName',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <EditOutlined onClick={() => handleEditHotel(record)} style={{ marginRight: 16 }} />
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDeleteHotel(record._id)}>
            <DeleteOutlined />
          </Popconfirm>
        </>
      ),
    },
  ]
// Pagination setup
const [vehiclePagination, setVehiclePagination] = useState({
  current: 1,
  pageSize: 5,
  total: vehicles.length,
});

const handleVehiclePageChange = (page, pageSize) => {
  setVehiclePagination({ ...vehiclePagination, current: page });
};

const [routePagination, setRoutePagination] = useState({
  current: 1,
  pageSize: 5,
  total: routes.length,
});

const handleRoutePageChange = (page, pageSize) => {
  setRoutePagination({ ...routePagination, current: page });
};

const [airportPagination, setAirportPagination] = useState({
  current: 1,
  pageSize: 5,
  total: airports.length,
});

const handleAirportPageChange = (page, pageSize) => {
  setAirportPagination({ ...airportPagination, current: page });
};

const [hotelPagination, setHotelPagination] = useState({
  current: 1,
  pageSize: 5,
  total: hotels.length,
});

const handleHotelPageChange = (page, pageSize) => {
  setHotelPagination({ ...hotelPagination, current: page });
};

  return (
    <div className="container">
      <Tabs defaultActiveKey="1" className="tabs">
        <TabPane tab="Add Vehicle" key="1">
          <Form form={vehicleForm} layout="vertical" onFinish={handleVehicleSubmit} className="form">
            <Form.Item
              name="vehicleName"
              label="Vehicle Name"
              rules={[{ required: true, message: 'Please enter the vehicle name' }]}
            >
              <Input placeholder="Enter vehicle name" />
            </Form.Item>
            <Form.Item
              name="numberOfPassengers"
              label="Number of Passengers"
              rules={[{ required: true, message: 'Please enter the number of passengers' }]}
            >
              <InputNumber min={1} max={100} placeholder="Enter number of passengers" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter the price' }]}
            >
              <InputNumber min={1} step={0.01} placeholder="Enter price" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="image"
              label="Image"
              valuePropName="fileList"
              getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
              rules={[{ required: true, message: 'Please upload an image' }]}
            >
              <Upload name="logo" listType="picture" beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Add Vehicle
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Add Route" key="2">
          <Form form={routeForm} layout="vertical" onFinish={handleRouteSubmit} className="form">
            <Form.Item
              name="routeName"
              label="Route Name"
              rules={[{ required: true, message: 'Please enter the route name' }]}
            >
              <Input placeholder="Enter route name" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Add Route
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Vehicle List" key="3">
          <Table columns={vehicleColumns} dataSource={vehicles} rowKey="_id"pagination={{
              current: vehiclePagination.current,
              pageSize: vehiclePagination.pageSize,
              total: vehiclePagination.total,
              onChange: handleVehiclePageChange,
            }} />
        </TabPane>
        <TabPane tab="Route List" key="4">
          <Table columns={routeColumns} dataSource={routes} rowKey="_id" pagination={{
              current: routePagination.current,
              pageSize: routePagination.pageSize,
              total: routePagination.total,
              onChange: handleRoutePageChange,
            }}/>
        </TabPane>
        <TabPane tab="Add Airport" key="5">
          <Form form={airportForm} layout="vertical" onFinish={handleAirportSubmit} className="form">
          <Form.Item
              name="airportName"
              label="Airport Name"
              rules={[{ required: true, message: 'Please enter the airport name' }]}
            >
              <Input placeholder="Enter airport name" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Add Airport
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Airport List" key="6">
          <Table columns={airportColumns} dataSource={airports} rowKey="_id" pagination={{
              current: airportPagination.current,
              pageSize: airportPagination.pageSize,
              total: airportPagination.total,
              onChange: handleAirportPageChange,
            }} />
        </TabPane>
        <TabPane tab="Add Hotel" key="7">
          <Form form={hotelForm} layout="vertical" onFinish={handleHotelSubmit} className="form">
          <Form.Item
              name="hotelName"
              label="Hotel Name"
              rules={[{ required: true, message: 'Please enter the hotel name' }]}
            >
              <Input placeholder="Enter hotel name" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Add Hotel
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="Hotel List" key="8">
          <Table columns={hotelColumns} dataSource={hotels} rowKey="_id" pagination={{
              current: hotelPagination.current,
              pageSize: hotelPagination.pageSize,
              total: hotelPagination.total,
              onChange: handleHotelPageChange,

          }}/>
        </TabPane>
      </Tabs>

      <Modal
        title="Edit Vehicle"
        open={isVehicleModalVisible}
        onCancel={() => setIsVehicleModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleVehicleUpdate} initialValues={editingVehicle}>
          <Form.Item
            name="vehicleName"
            label="Vehicle Name"
            rules={[{ required: true, message: 'Please enter the vehicle name' }]}
          >
            <Input placeholder="Enter vehicle name" />
          </Form.Item>
          <Form.Item
            name="numberOfPassengers"
            label="Number of Passengers"
            rules={[{ required: true, message: 'Please enter the number of passengers' }]}
          >
            <InputNumber min={1} max={100} placeholder="Enter number of passengers" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: 'Please enter the price' }]}
          >
            <InputNumber min={1} step={0.01} placeholder="Enter price" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="image"
            label="Image"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
          >
            <Upload
              name="logo"
              listType="picture"
              beforeUpload={() => false}
              defaultFileList={editingVehicle?.image}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Update Vehicle
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Route"
        open={isRouteModalVisible}
        onCancel={() => setIsRouteModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleRouteUpdate} initialValues={editingRoute}>
          <Form.Item
            name="routeName"
            label="Route Name"
            rules={[{ required: true, message: 'Please enter the route name' }]}
          >
            <Input placeholder="Enter route name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Update Route
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Airport"
        open={isAirportModalVisible}
        onCancel={() => setIsAirportModalVisible(false)}
        footer={null}
        >
        <Form layout="vertical" onFinish={handleAirportUpdate} initialValues={editingAirport}>
          <Form.Item
            name="airportName"
            label="Airport Name"
            rules={[{ required: true, message: 'Please enter the airport name' }]}
          >
            <Input placeholder="Enter airport name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Update Airport
            </Button>
          </Form.Item>
        </Form>
        </Modal>
        <Modal
        title="Edit Hotel"
        open={isHotelModalVisible}
        onCancel={() => setIsHotelModalVisible(false)}
        footer={null}
        >
          <Form layout="vertical" onFinish={handleHotelUpdate} initialValues={editingHotel}>
            <Form.Item
              name="hotelName"
              label="Hotel Name"
              rules={[{ required: true, message: 'Please enter the hotel name' }]}
            >
              <Input placeholder="Enter hotel name" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Update Hotel
              </Button>
            </Form.Item>
          </Form>
        </Modal>
    </div>
  );
};

export default VehicleAndRoute;
