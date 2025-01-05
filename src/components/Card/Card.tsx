import "./Card.css";

interface CardProps {
  img?: string;
  icon: string;
  title: string;
  content: string;
}

const Card = ({ img, icon, title, content }: CardProps) => {
  return (
    <div className="card">
      <div className="card-content">
        <div className="icon">
          <img src={icon} alt="" />
        </div>
        <h3 className="title">{title}</h3>
        <p className="content">{content}</p>
      </div>
      {img && (
        <div className="card-img">
          <img src={img} alt="" />
        </div>
      )}
    </div>
  );
};

export default Card;
