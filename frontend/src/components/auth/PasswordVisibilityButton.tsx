import { Eye, EyeOff } from "lucide-react";

interface PasswordVisibilityButtonProps {
  isVisible: boolean;
  onToggle: () => void;
  className?: string;
}

export function PasswordVisibilityButton({
  isVisible,
  onToggle,
  className = "input-action",
}: PasswordVisibilityButtonProps) {
  return (
    <button
      type="button"
      className={className}
      onClick={onToggle}
      aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
    >
      {isVisible ? <EyeOff /> : <Eye />}
    </button>
  );
}
