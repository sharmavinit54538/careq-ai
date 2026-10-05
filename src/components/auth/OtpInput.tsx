import React, { useRef, useEffect } from 'react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false
}) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize input refs array
  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
    // Focus first input on mount
    inputsRef.current[0]?.focus();
  }, [length]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, char: string) => {
    // Only accept numeric
    const clean = char.replace(/[^0-9]/g, '');
    if (!clean) {
      const newDigits = [...digits];
      newDigits[index] = '';
      onChange(newDigits.join(''));
      return;
    }

    const lastChar = clean[clean.length - 1];
    const newDigits = [...digits];
    newDigits[index] = lastChar;
    onChange(newDigits.join(''));

    // Move to next input if available
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, length);
    if (pasted) {
      onChange(pasted);
      const nextFocus = Math.min(pasted.length, length - 1);
      inputsRef.current[nextFocus]?.focus();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '16px 0'
      }}
      onPaste={handlePaste}
    >
      {digits.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            inputsRef.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          onFocus={(e) => e.target.select()}
          aria-label={`Digit ${idx + 1} of verification code`}
          style={{
            width: '48px',
            height: '56px',
            fontSize: '1.5rem',
            fontWeight: 700,
            textAlign: 'center',
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${
              hasError
                ? 'var(--danger-solid)'
                : digit
                ? 'var(--primary-600)'
                : 'var(--slate-200)'
            }`,
            background: disabled ? 'var(--slate-100)' : '#ffffff',
            color: 'var(--slate-900)',
            outline: 'none',
            fontFamily: 'var(--font-heading)',
            boxShadow: digit ? '0 2px 6px rgba(13, 148, 136, 0.15)' : 'none',
            transition: 'all 0.15s ease'
          }}
        />
      ))}
    </div>
  );
};
