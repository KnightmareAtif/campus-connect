import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'free' | 'busy' | 'offline';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge = ({ status, showLabel = false, size = 'md' }: StatusBadgeProps) => {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const statusLabels = {
    free: 'Free',
    busy: 'In Class',
    offline: 'Offline',
  };

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'rounded-full',
          sizeClasses[size],
          status === 'free' && 'bg-status-free animate-pulse-soft',
          status === 'busy' && 'bg-status-busy',
          status === 'offline' && 'bg-status-offline'
        )}
      />
      {showLabel && (
        <span className={cn(
          'text-sm font-medium',
          status === 'free' && 'text-status-free',
          status === 'busy' && 'text-status-busy',
          status === 'offline' && 'text-muted-foreground'
        )}>
          {statusLabels[status]}
        </span>
      )}
    </div>
  );
};
