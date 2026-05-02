import type{ ReactNode } from 'react';
import './authlayout.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {children}
      </div>
    </div>
  );
}
