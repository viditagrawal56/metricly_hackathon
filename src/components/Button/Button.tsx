import "./Button.css";

interface ButtonProps {
  content?: string;
  alt?: boolean;
  href?: string;
  sm?: boolean;
}

const Button = ({ content = "Button", alt, sm, href = "/" }: ButtonProps) => {
  return (
    <a href={href} className={`btn ${alt && "btn-alt"} ${sm && "btn-sm"}`}>
      {content}
    </a>
  );
};

export default Button;
