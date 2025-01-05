import "./Button.css";

interface ButtonProps {
  content?: string;
  alt?: boolean;
  sm?: boolean;
}

const Button = ({ content = "Button", alt, sm }: ButtonProps) => {
  return (
    <a href="/" className={`btn ${alt && "btn-alt"} ${sm && "btn-sm"}`}>
      {content}
    </a>
  );
};

export default Button;
