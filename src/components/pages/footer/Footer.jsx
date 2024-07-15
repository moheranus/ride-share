import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaPinterestP, FaBehance } from 'react-icons/fa';
import './Footer.css';

function Footer() {
    const currentYear = new Date().getFullYear();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerTitle, setDrawerTitle] = useState('');

    const showDrawer = (title) => {
        setDrawerTitle(title);
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-column">
                    <h2 className="footer-logo">johnwayneShuttle</h2>
                    <p> We are dedicated to providing you with a safe, reliable, and comfortable ride to your destination.</p>
                    <p>johnwayneShuttle.com</p>
                    <p>714-757-3249</p>
                </div>
                <div className="footer-column">
                    <h3>ABOUT Express</h3>
                    <ul>
                        <li><a onClick={() => showDrawer('About Us')} style={{ cursor: 'pointer' }}>johnwayneShuttle .com</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h3>TOP SERVICES</h3>
                    <ul>
                        <li><a href="#airport">Airport transfers</a></li>
                        <li><a href="#event">Point to Point</a></li>
                        <li><a href="#chauffeur">Hourly Charter</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {currentYear} Copyright. <span onClick={() => showDrawer('Developers Information')} style={{ cursor: 'pointer' }}>Byte Artisans.</span></p>
            </div>

            <Drawer
                title={drawerTitle}
                placement="right"
                onClose={closeDrawer}
                open={drawerVisible}
            >
                {drawerTitle === 'Developers Information' ? (
                    <div className='drawer-contents'>
                        <div className='dev-info'>
                            <p>Name: Daniel Shobe</p>
                            <p>Phone: +251 949 0528 48</p>
                            <p>Email: danielshobe90@gmail.com</p>
                            <p>GitHub: <a href="https://github.com/moheranus" target="_blank" rel="noopener noreferrer">github.com/moheranus</a></p>
                        </div>
                        <div className='dev-info'>
                            <p>Name: Nebyat Ahmed</p>
                            <p>Phone: +251 934 6617 61</p>
                            <p>Email: nebyatAhmed21@gmail.com</p>
                            <p>GitHub: <a href="https://github.com/Afiya21" target="_blank" rel="noopener noreferrer">github.com/Afiya21</a></p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>About Us</h3>
                        <p>Welcome to our rideshare service! We are dedicated to providing you with a safe, reliable, and comfortable ride to your destination. Our team of professional drivers is committed to ensuring that you have the best experience possible.</p>

                    </div>
                )}
            </Drawer>
        </footer>
    );
}

export default Footer;
