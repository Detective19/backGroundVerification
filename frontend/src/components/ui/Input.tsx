import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              block w-full rounded-lg border bg-white/50 backdrop-blur-sm 
              transition-all duration-200 
              ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 text-slate-900 
              focus:outline-none focus:ring-2 focus:ring-primary-500/50 
              ${error 
                ? 'border-error-300 focus:border-error-500 focus:ring-error-500/50' 
                : 'border-slate-200 focus:border-primary-500'
              } 
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error-600 animate-fade-in">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
