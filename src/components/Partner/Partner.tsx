import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Partner.css";

import acmeLogo from "../../assets/langflow.png";
import quantumLogo from "../../assets/datastax.png";
import echoLogo from "../../assets/astra.png";
import celestialLogo from "../../assets/openai.png";
import pulseLogo from "../../assets/groq.png";
import apexLogo from "../../assets/nvdia.png";

const Partner = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    pauseOnHover: false,
    swipe: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="partner">
      <p>Enhancing the Analysis with New Technology</p>
      <div className="slider-wrapper">
        <Slider {...settings}>
          <div className="slide-item">
            <img src={acmeLogo} alt="Acme" />
          </div>
          <div className="slide-item">
            <img src={quantumLogo} alt="Quantum" />
          </div>
          <div className="slide-item">
            <img src={echoLogo} alt="Echo" />
          </div>
          <div className="slide-item">
            <img src={celestialLogo} alt="Celestia" />
          </div>
          <div className="slide-item">
            <img src={pulseLogo} alt="Pulse" />
          </div>
          <div className="slide-item">
            <img src={apexLogo} alt="Apex" />
          </div>
        </Slider>
      </div>
    </div>
  );
};

export default Partner;
