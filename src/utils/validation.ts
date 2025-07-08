export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .trim();
};

export const validateSearchQuery = (query: string): string => {
  // Limit search query length and sanitize
  const maxLength = 100;
  const sanitized = sanitizeInput(query);
  return sanitized.length > maxLength
    ? sanitized.substring(0, maxLength)
    : sanitized;
};
