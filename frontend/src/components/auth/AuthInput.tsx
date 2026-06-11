import type {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import type { LucideIcon } from "lucide-react";
import "./authinput.css";

interface AuthInputProps {
  label: string;
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder: string;
  icon: LucideIcon;
  value?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  endAdornment?: ReactNode;
  onChange?: InputHTMLAttributes<HTMLInputElement>["onChange"];
  "data-testid"?: string;
}

export function AuthInput({
  label,
  type,
  name,
  placeholder,
  icon: Icon,
  value,
  required = true,
  autoComplete,
  inputMode,
  minLength,
  maxLength,
  pattern,
  endAdornment,
  onChange,
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
          className={`form-input${endAdornment ? " form-input-with-action" : ""}`}
          value={value}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onChange={onChange}
          data-testid={testId}
        />

        {endAdornment}
      </div>
    </div>
  );
}
