import React from 'react';
import { Link } from 'react-router-dom';

interface CareQLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  clickable?: boolean;
  light?: boolean;
}

export const CareQLogo: React.FC<CareQLogoProps> = ({
  size = 'md',
  showTagline = false,
  clickable = true,
  light = false
}) => {
  const iconSizes = {
    sm: { w: 32, h: 32, r: 8, font: '1.25rem', badgeW: 28, badgeH: 16, badgeF: '9px' },
    md: { w: 42, h: 42, r: 11, font: '1.55rem', badgeW: 34, badgeH: 19, badgeF: '10.5px' },
    lg: { w: 52, h: 52, r: 14, font: '1.95rem', badgeW: 40, badgeH: 22, badgeF: '12px' }
  };

  const current = iconSizes[size];

  const content = (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '3px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
        {/* SVG Health Cross + AI Pulse Icon */}
        <div
          style={{
            width: current.w,
            height: current.h,
            borderRadius: current.r,
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.25)',
            flexShrink: 0
          }}
        >
          <svg
            width={current.w * 0.72}
            height={current.h * 0.72}
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Medical Cross Arms */}
            <rect x="7" y="13.5" width="18" height="5" rx="2.5" fill="#ffffff" />
            <rect x="13.5" y="7" width="5" height="18" rx="2.5" fill="#ffffff" />
            {/* Heartbeat Telemetry Wave */}
            <path
              d="M7 16h4l2-3 2.5 6 2-4 1.5 1h6"
              stroke="#0d9488"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* AI Intelligence Spark Node */}
            <circle cx="23" cy="8" r="2.2" fill="#38bdf8" />
            <circle cx="23" cy="8" r="1.1" fill="#ffffff" />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: current.font,
              color: light ? '#ffffff' : 'var(--slate-900)',
              letterSpacing: '-0.03em',
              lineHeight: 1
            }}
          >
            Care<span style={{ color: '#0d9488' }}>Q</span>
          </span>

          {/* AI Badge */}
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2px 7px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #0d9488, #0284c7)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: current.badgeF,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 2px 6px rgba(13, 148, 136, 0.25)'
            }}
          >
            AI
          </span>
        </div>
      </div>

      {showTagline && (
        <span
          style={{
            fontSize: '0.8125rem',
            fontWeight: 500,
            color: light ? '#94a3b8' : 'var(--slate-500)',
            letterSpacing: '0.01em',
            paddingLeft: '2px'
          }}
        >
          Smarter Healthcare. Better Care.
        </span>
      )}
    </div>
  );

  if (clickable) {
    return (
      <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }} aria-label="CareQ AI Home">
        {content}
      </Link>
    );
  }

  return content;
};
