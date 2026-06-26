import type { Alert } from '../types/alert';

interface AlertBannerProps {
  alert: Alert;
}

export function AlertBanner({ alert }: AlertBannerProps) {
  switch (alert.kind) {
    case 'success':
      return <div style={{ color: 'green' }}>{alert.message}</div>;
    case 'error':
      return <div style={{ color: 'red' }}>{alert.message} (code: {alert.code})</div>;
    case 'loading':
      return <div>Loading... {alert.progress}%</div>;
  }
}
