import Card from "../Card/Card";
import cardData from "./cardData";
import "./Features.css";

const Features = () => {
  const Cards = cardData.map((card) => (
    <Card
      key={card.id}
      icon={card.icon}
      title={card.title}
      content={card.content}
      img={card.img}
    />
  ));
  return (
    <div className="features" id="features">
      <div className="features-title">
        <h1>Features that work for your future.</h1>
        <p>
          Check out our amazing features and experience the power of Vaultflow
          for yourself.
        </p>
      </div>
      <div className="features-card">{Cards}</div>
    </div>
  );
};

export default Features;
