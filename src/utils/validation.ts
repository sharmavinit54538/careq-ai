export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Too weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
  hasLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export const evaluatePasswordStrength = (password: string): PasswordStrength => {
  const hasLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  let score = 0;
  if (hasLength) score++;
  if (hasUppercase && hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  if (password.length < 6) {
    score = 0;
  }

  let label: PasswordStrength['label'] = 'Too weak';
  let color = '#ef4444';

  switch (score) {
    case 0:
    case 1:
      label = 'Weak';
      color = '#ef4444';
      break;
    case 2:
      label = 'Fair';
      color = '#f59e0b';
      break;
    case 3:
      label = 'Good';
      color = '#0ea5e9';
      break;
    case 4:
      label = 'Strong';
      color = '#10b981';
      break;
  }

  return {
    score,
    label,
    color,
    hasLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecial
  };
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const maskEmail = (email: string): string => {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length < 6) return phone;
  return `${cleaned.slice(0, 3)}****${cleaned.slice(-4)}`;
};
