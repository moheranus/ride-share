import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, notification } from 'antd';
import './AdminMessage.css';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const { confirm } = Modal;

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/messages');
                const sortedMessages = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setMessages(sortedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();
    }, []);

    const showDeleteConfirm = (id) => {
        confirm({
            title: 'Are you sure you want to delete this message?',
            content: 'This action cannot be undone',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteMessage(id);
            },
        });
    };

    const deleteMessage = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/messages/${id}`);
            setMessages(messages.filter(message => message._id !== id));
            notification.success({
                message: 'Delete Successful',
                description: 'The message has been successfully deleted.',
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            notification.error({
                message: 'Delete Failed',
                description: 'There was an error deleting the message. Please try again.',
            });
        }
    };

    return (
        <div className="admin-messages-container">
            <div className="nine">
                <h1>Contact Message<span>Sent from client</span></h1>
            </div>
            <div className='messageList'>
                {messages.length === 0 ? (
                    <p className="no-messages">No messages found</p>
                ) : (
                    <ul className="messages-list">
                        {messages.map((message) => (
                            <li key={message._id} className="message-item">
                                <h3 className="message-subject">{message.subject}</h3>
                                <p><strong>Name:</strong> {message.name}</p>
                                <p><strong>Email:</strong> {message.email}</p>
                                <p><strong>Message:</strong> {message.message}</p>
                                <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>
                                <Button
                                    type="primary"
                                    danger
                                    onClick={() => showDeleteConfirm(message._id)}
                                    className="delete-button"
                                >
                                    Delete
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;
