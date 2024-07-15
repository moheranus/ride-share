import React from 'react';
import { Form, Input, Button, DatePicker, Space, Steps } from 'antd';

const { Step } = Steps;

const PointToPointForm = ({ currentStep, bookingData, handleNext, handlePrev, handleBookingSubmit }) => {
  const [form] = Form.useForm();

  return (
    <Form layout="vertical" form={form}>
      <Steps current={currentStep}>
        <Step title="Details" />
        <Step title="Confirm" />
      </Steps>
      {currentStep === 0 && (
        <>
          <Form.Item
            label="Pickup Location"
            name="pickupLocation"
            rules={[{ required: true, message: 'Please input your pickup location!' }]}
          >
            <Input placeholder="Pickup Location" />
          </Form.Item>
          <Form.Item
            label="Dropoff Location"
            name="dropoffLocation"
            rules={[{ required: true, message: 'Please input your dropoff location!' }]}
          >
            <Input placeholder="Dropoff Location" />
          </Form.Item>
          <Form.Item
            label="Pickup Date"
            name="pickupDate"
            rules={[{ required: true, message: 'Please select a pickup date!' }]}
          >
            <DatePicker showTime />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" onClick={() => handleNext(form.getFieldsValue())}>
                Next
              </Button>
            </Space>
          </Form.Item>
        </>
      )}
      {currentStep === 1 && (
        <>
          <Form.Item label="Review">
            <div>
              <strong>Pickup Location:</strong> {bookingData.pickupLocation}
            </div>
            <div>
              <strong>Dropoff Location:</strong> {bookingData.dropoffLocation}
            </div>
            <div>
              <strong>Pickup Date:</strong> {bookingData.pickupDate}
            </div>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handlePrev}>Previous</Button>
              <Button type="primary" onClick={handleBookingSubmit}>
                Submit
              </Button>
            </Space>
          </Form.Item>
        </>
      )}
    </Form>
  );
};

export default PointToPointForm;
