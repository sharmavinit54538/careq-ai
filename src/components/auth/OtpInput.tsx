import React, { useRef, useEffect, useState } from 'react';

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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(0);

  // Initialize input refs array
  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
    inputsRef.current[0]?.focus();
  }, [length]);

  const digits = value.split('').slice(0, length);
  while (digits.length < length) {
    digits.push('');
  }

  const handleChange = (index: number, char: string) => {
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
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputsRef.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        onChange(newDigits.join(''));
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
        gap: '8px',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '18px 0'
      }}
      onPaste={handlePaste}
    >
      {digits.map((digit, idx) => {
        const isFocused = focusedIndex === idx;
        let borderColor = 'rgba(255, 255, 255, 0.12)';
        let boxShadow = 'none';

        if (hasError) {
          borderColor = '#ef4444';
          boxShadow = isFocused ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : 'none';
        } else if (isFocused) {
          borderColor = '#38bdf8';
          boxShadow = '0 0 0 3px rgba(56, 189, 248, 0.2)';
        } else if (digit) {
          borderColor = 'rgba(56, 189, 248, 0.45)';
        }

        return (
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
            onFocus={(e) => {
              setFocusedIndex(idx);
              e.target.select();
            }}
            onBlur={() => setFocusedIndex(null)}
            aria-label={`Digit ${idx + 1} of verification code`}
            style={{
              width: '46px',
              height: '56px',
              fontSize: '1.5rem',
              fontWeight: 700,
              textAlign: 'center',
              borderRadius: '10px',
              border: `1.5px solid ${borderColor}`,
              background: disabled ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
              color: '#ffffff',
              outline: 'none',
              fontFamily: 'inherit',
              boxShadow,
              transition: 'all 0.15s ease',
              caretColor: '#38bdf8'
            }}
          />
        );
      })}
    </div>
  );
};
