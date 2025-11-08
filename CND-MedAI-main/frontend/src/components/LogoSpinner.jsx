import React from 'react';
import { cn } from '../utils/cn';

const LogoSpinner = ({
  size = 150,
  ringWidth = 5,
  label,
  inline = false,
  className,
  spinnerClassName,
  labelClassName,
}) => {
  const spinnerStyle = {
    width: size,
    height: size,
  };

  const haloStyle = {
    borderWidth: ringWidth,
    borderColor: 'rgba(94, 234, 212, 0.18)',
    animationDuration: '2.8s',
    pointerEvents: 'none',
    boxSizing: 'border-box',
  };

  const logoStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    zIndex: 1,
    position: 'relative',
    display: 'block',
  };

  const spinnerMarkup = (
    <div
      className={cn('relative flex items-center justify-center rounded-full', spinnerClassName)}
      style={spinnerStyle}
    >
      <div
        className="absolute inset-0 rounded-full border animate-ping"
        style={haloStyle}
      />
      <img
        src="/Logo.png"
        alt="MedAI Assist logo"
        className="block"
        style={logoStyle}
      />
    </div>
  );

  if (inline) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={cn('inline-flex items-center', className)}
      >
        {spinnerMarkup}
        {label ? (
          <span className={cn('ml-2 text-sm text-muted-foreground', labelClassName)}>{label}</span>
        ) : null}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn('flex flex-col items-center justify-center gap-3', className)}
    >
      {spinnerMarkup}
      {label ? (
        <span className={cn('text-sm text-muted-foreground text-center', labelClassName)}>{label}</span>
      ) : null}
    </div>
  );
};

export default LogoSpinner;
