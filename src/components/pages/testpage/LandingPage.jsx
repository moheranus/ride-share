import React, { useRef, useState, useEffect } from 'react';
import Header from "../landingpage/Header";
import Home from "../../pages/landingpage/home/Home";
import Service from "../../pages/landingpage/service/Service";
import Feature from "../../pages/landingpage/feature/Feature";
import Booking from "../../pages/landingpage/booking/Booking";
import Contact from "../../pages/landingpage/contact/Contact";
import Footer from "../../pages/footer/Footer";
import { useAuth } from '../../../authcontext/AuthContext';

import './landingPage.css';

function App() {
  const { isAuthenticated, userRole } = useAuth();
  const [activeSection, setActiveSection] = useState('home');
  const homeRef = useRef(null);
  const serviceRef = useRef(null);
  const featuredCarsRef = useRef(null);
  const brandsRef = useRef(null);
  const contactRef = useRef(null);

  const sectionRefs = {
    home: homeRef,
    service: serviceRef,
    featuredCars: featuredCarsRef,
    brands: brandsRef,
    contact: contactRef
  };

  const scrollToSection = (section) => {
    sectionRefs[section].current.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(section);
  };

  const handleScroll = () => {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    Object.keys(sectionRefs).forEach(section => {
      const ref = sectionRefs[section]?.current;
      if (ref && ref.offsetTop <= scrollPos && ref.offsetTop + ref.offsetHeight > scrollPos) {
        setActiveSection(section);
      }
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <Header scrollToSection={scrollToSection} activeSection={activeSection} />
      <Home ref={homeRef} scrollToServiceSection={() => scrollToSection('service')} />
      <Service ref={serviceRef} />
      <Feature ref={featuredCarsRef} />
      <Contact ref={contactRef} />
      {/* {isAuthenticated && userRole === 'user' && <Booking ref={brandsRef} />} */}
      <Footer />
    </div>
  );
}

export default App;
