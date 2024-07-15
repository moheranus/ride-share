import React from 'react';
import { Form, Input, Button, DatePicker, InputNumber, Space, Steps } from 'antd';

const { Step } = Steps;

const HourlyCharterServiceForm = ({ currentStep, bookingData, handleNext, handlePrev, handleBookingSubmit }) => {
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
            label="Number of Hours"
            name="hours"
            rules={[{ required: true, message: 'Please input the number of hours!' }]}
          >
            <InputNumber min={1} max={24} />
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
              <strong>Number of Hours:</strong> {bookingData.hours}
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

export default HourlyCharterServiceForm;
