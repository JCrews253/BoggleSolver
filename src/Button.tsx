import "./Styles/Button.css";

interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: JSX.Element;
}

const Button = ({ onClick, disabled = false, children }: ButtonProps) => {
  return (
    <button className="button-base" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
