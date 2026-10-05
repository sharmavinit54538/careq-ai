import React from 'react';

export interface GeminiIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  variant?: 'gradient' | 'current' | 'multicolor';
}

export const GeminiIcon: React.FC<GeminiIconProps> = ({
  size = 20,
  className = '',
  variant = 'current',
  style,
  ...props
}) => {
  const gradientId = React.useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...props}
    >
      <defs>
        <linearGradient id={`${gradientId}-gemini`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E88E5" />
          <stop offset="35%" stopColor="#00BCD4" />
          <stop offset="70%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Primary 4-pointed Gemini star */}
      <path
        d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
        fill={variant === 'gradient' || variant === 'multicolor' ? `url(#${gradientId}-gemini)` : 'currentColor'}
      />
      {/* Secondary sparkle at top-right */}
      <path
        d="M19 1.5C19 3.15685 17.6569 4.5 16 4.5C17.6569 4.5 19 5.84315 19 7.5C19 5.84315 20.3431 4.5 22 4.5C20.3431 4.5 19 3.15685 19 1.5Z"
        fill={variant === 'gradient' || variant === 'multicolor' ? `url(#${gradientId}-gemini)` : 'currentColor'}
        opacity={0.8}
      />
    </svg>
  );
};
