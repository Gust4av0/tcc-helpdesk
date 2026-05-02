import './authbutton.css';

interface AuthButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;

  'data-testid'?: string;
}

export function AuthButton({
  children,
  type = 'submit',
  onClick,
  'data-testid': testId,
}: AuthButtonProps) {
  return (
    <button
      type={type}
      className="auth-submit-btn"
      onClick={onClick}

      data-testid={testId}
    >
      {children}
    </button>
  );
}