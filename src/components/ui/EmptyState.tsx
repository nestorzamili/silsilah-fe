import { clsx } from 'clsx';
import { isValidElement, createElement } from 'react';
import { Button } from './button';
import type { ComponentType, SVGProps, ReactNode } from 'react';

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface EmptyStateProps {
  icon?: IconComponent | ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!Icon) return null;
    // If it's already a valid React element, return it
    if (isValidElement(Icon)) {
      return Icon;
    }
    // Otherwise treat it as a component and render it
    // This handles both function components and forwardRef components
    return createElement(Icon as IconComponent, { className: 'h-8 w-8' });
  };

  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-slate-100 text-slate-400">
          {renderIcon()}
        </div>
      )}
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && (
        <Button className="mt-4" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Terjadi Kesalahan',
  message = 'Tidak dapat memuat data. Silakan coba lagi.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className,
      )}
    >
      <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-500">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" className="mt-4" onClick={onRetry}>
          Coba Lagi
        </Button>
      )}
    </div>
  );
}
