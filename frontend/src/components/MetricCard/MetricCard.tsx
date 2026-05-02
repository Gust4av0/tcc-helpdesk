import type { LucideIcon } from 'lucide-react';
import './metriccard.css';

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'blue' | 'purple' | 'orange' | 'green';
  trend?: string;
}

export function MetricCard({ title, value, icon: Icon, color, trend }: MetricCardProps) {
  return (
    <div className="metric-card">
      <div className="metric-card-content">
        <div className="metric-card-info">
          <p className="metric-card-title">{title}</p>
          <p className="metric-card-value">{value}</p>
          {trend && (
            <p className="metric-card-trend">{trend}</p>
          )}
        </div>
        <div className={`metric-card-icon ${color}`}>
          <Icon />
        </div>
      </div>
    </div>
  );
}
