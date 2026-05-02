import type { LucideIcon } from 'lucide-react';
import './authinput.css';

interface AuthInputProps {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  icon: LucideIcon;
  required?: boolean;

  
  'data-testid'?: string;
}

export function AuthInput({
  label,
  type,
  name,
  placeholder,
  icon: Icon,
  required = true,
  'data-testid': testId,
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

          
          data-testid={testId}
        />
      </div>
    </div>
  );
}