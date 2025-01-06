import "./Button.css";

interface ButtonProps {
  content?: string;
  alt?: boolean;
  href?: string;
  sm?: boolean;
  lg?: boolean;
}

const Button = ({
  content = "Button",
  alt,
  sm,
  href = "/",
  lg,
}: ButtonProps) => {
  return (
    <a
      href={href}
      className={`btn ${alt && "btn-alt"} ${sm && "btn-sm"} ${lg && "btn-lg"}`}
    >
      {content}
    </a>
  );
};

export default Button;
