import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DashboardCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  to: string;
  variant?: 'default' | 'accent' | 'muted';
  badge?: string | number;
}

export const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  to, 
  variant = 'default',
  badge 
}: DashboardCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Link
        to={to}
        className={cn(
          'group relative flex flex-col gap-3 rounded-xl p-6 shadow-card transition-all duration-300 hover:shadow-elevated',
          variant === 'default' && 'bg-card border border-border',
          variant === 'accent' && 'bg-primary text-primary-foreground',
          variant === 'muted' && 'bg-secondary'
        )}
      >
        {badge !== undefined && (
          <span className={cn(
            'absolute top-4 right-4 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            variant === 'accent' 
              ? 'bg-accent text-accent-foreground' 
              : 'bg-primary text-primary-foreground'
          )}>
            {badge}
          </span>
        )}
        
        <div className={cn(
          'flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110',
          variant === 'default' && 'bg-primary/10 text-primary',
          variant === 'accent' && 'bg-primary-foreground/20 text-primary-foreground',
          variant === 'muted' && 'bg-primary/10 text-primary'
        )}>
          <Icon className="h-6 w-6" />
        </div>
        
        <div>
          <h3 className={cn(
            'font-display text-lg font-semibold',
            variant === 'accent' ? 'text-primary-foreground' : 'text-foreground'
          )}>
            {title}
          </h3>
          {description && (
            <p className={cn(
              'mt-1 text-sm',
              variant === 'accent' ? 'text-primary-foreground/80' : 'text-muted-foreground'
            )}>
              {description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
