import React from 'react';
import { evaluatePasswordStrength } from '../../utils/validation';
import { Check, X } from 'lucide-react';

interface PasswordStrengthProps {
  password: string;
  showRequirements?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  password,
  showRequirements = true
}) => {
  if (!password) return null;

  const strength = evaluatePasswordStrength(password);

  const requirements = [
    { label: 'At least 8 characters', met: strength.hasLength },
    { label: 'At least 1 uppercase letter (A-Z)', met: strength.hasUppercase },
    { label: 'At least 1 lowercase letter (a-z)', met: strength.hasLowercase },
    { label: 'At least 1 number (0-9)', met: strength.hasNumber },
    { label: 'At least 1 special character (!@#$%^&*)', met: strength.hasSpecial }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
      {/* Strength Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '4px', flex: 1, height: '5px' }}>
          {[0, 1, 2, 3].map((step) => {
            const isFilled = strength.score > step;
            return (
              <div
                key={step}
                style={{
                  flex: 1,
                  height: '100%',
                  borderRadius: '3px',
                  backgroundColor: isFilled ? strength.color : 'var(--slate-200)',
                  transition: 'background-color 0.25s ease'
                }}
              />
            );
          })}
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: strength.color,
            minWidth: '60px',
            textAlign: 'right',
            fontFamily: 'var(--font-heading)'
          }}
        >
          {strength.label}
        </span>
      </div>

      {/* Requirement Checklist */}
      {showRequirements && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '4px 12px',
            background: 'var(--slate-50)',
            padding: '10px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--slate-200)',
            fontSize: '0.75rem'
          }}
        >
          {requirements.map((req, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: req.met ? 'var(--success-solid)' : 'var(--slate-500)',
                fontWeight: req.met ? 600 : 400,
                transition: 'color 0.2s ease'
              }}
            >
              {req.met ? (
                <Check size={13} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              ) : (
                <X size={13} strokeWidth={2} style={{ flexShrink: 0, opacity: 0.6 }} />
              )}
              <span>{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
