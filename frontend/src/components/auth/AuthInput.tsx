import type { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import "./authinput.css";

interface AuthInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  minLength?: number;
  "data-testid"?: string;
}

export function AuthInput({
  label,
  type,
  name,
  placeholder,
  icon: Icon,
  required = true,
  autoComplete,
  inputMode,
  minLength,
  "data-testid": testId,
}: AuthInputProps) {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>

      <div className="input-wrapper">
        <Icon className="input-icon" />

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className="form-input"
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          minLength={minLength}
          data-testid={testId}
        />
      </div>
    </div>
  );
}
