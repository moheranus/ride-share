import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe } from 'react-icons/fa';
import { message as antdMessage } from 'antd';

const Contact = React.forwardRef((props, ref) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/sendemail', formData);
            console.log(response.data);
            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            // Show success message
            antdMessage.success('Message sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            // Show error message
            antdMessage.error('Failed to send message. Please try again later.');
        }
    };

    return (
        <section id="contact" ref={ref} className="contact-form-container">
            <div className="contact-form-title">
                <div className="nine">
                    <h1>Contact Us<span>We Reply Instantly</span></h1>
                </div>
            </div>
            <div className="contact-form-content">
                <div className="contact-form-left">
                    <h3>Get in touch</h3>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                        <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleChange} required />
                        <textarea name="message" placeholder="Message" value={formData.message} onChange={handleChange} required></textarea>
                        <button type="submit">Send Message</button>
                    </form>
                </div>
                <div className="contact-form-right">
                    <h3>Contact us</h3>
                    <ul>
                        <li><FaMapMarkerAlt className='contact-icon'/> Address: address</li>
                        <li><FaPhoneAlt className='contact-icon'/> Cell: 714-757-3249</li>
                        <li><FaPhoneAlt className='contact-icon'/> Office: 206-285-2818</li>
                        <li><FaEnvelope className='contact-icon'/> Email: Expresslimousine41@gmail.com</li>
                        <li><FaGlobe className='contact-icon'/> Website: johnwayneShuttle .com</li>
                    </ul>
                </div>
            </div>
        </section>
    );
});

export default Contact;
