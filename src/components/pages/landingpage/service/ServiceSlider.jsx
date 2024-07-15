import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import gmc2 from '../../../../assets/images/gmc2.png';
import gmc3 from '../../../../assets/images/gmc3.png';
import gmc4 from '../../../../assets/images/gmc4.png';
import gmc5 from '../../../../assets/images/gmc5.png';
import ford1 from '../../../../assets/images/ford1.png';
import ford2 from '../../../../assets/images/ford2.png';
import sit1 from '../../../../assets/images/sit1.png';
import sit2 from '../../../../assets/images/sit2.png';
import "./serviceSlider.css";

const ServiceSlider = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      }
    ]
  };

  return (
    <div className='slider-wrappers'>
      <div className='service-slider-cont'>
        <Slider {...sliderSettings}>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={gmc2} alt="car1" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={gmc3} alt="car2" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={gmc4} alt="car3" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={gmc5} alt="car4" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={ford1} alt="car5" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={ford2} alt="car6" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={sit1} alt="car7" />
            </div>
          </div>
          <div className='slider-item'>
            <div className='slider-img'>
              <img src={sit2} alt="car8" />
            </div>
          </div>
          {/* Add more slides as needed */}
        </Slider>
      </div>
    </div>
  );
};

export default ServiceSlider;
