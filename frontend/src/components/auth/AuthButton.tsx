import "./authbutton.css";

interface AuthButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  "data-testid"?: string;
}

export function AuthButton({
  children,
  type = "submit",
  onClick,
  disabled = false,
  "data-testid": testId,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      className="auth-submit-btn"
      onClick={onClick}
      disabled={disabled}
      aria-busy={disabled}
      data-testid={testId}
    >
      {children}
    </button>
  );
}
