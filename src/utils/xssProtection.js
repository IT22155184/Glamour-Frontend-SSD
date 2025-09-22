import DOMPurify from 'dompurify';
import he from 'he';

/**
 * Sanitize HTML content on the client side
 * @param {string} content - Content to sanitize
 * @returns {string} - Sanitized content
 */
export const sanitizeHTML = (content) => {
  if (typeof content !== 'string') {
    return content;
  }
  
  const config = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'textarea', 'style', 'link'],
    FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover', 'onfocus', 'onblur', 'style', 'class']
  };
  
  return DOMPurify.sanitize(content, config);
};

/**
 * Escape HTML entities
 * @param {string} content - Content to escape
 * @returns {string} - Escaped content
 */
export const escapeHTML = (content) => {
  if (typeof content !== 'string') {
    return content;
  }
  
  return he.encode(content, {
    useNamedReferences: true,
    decimal: false,
    allowUnsafeSymbols: true,
  });
};

/**
 * Validate and sanitize user input
 * @param {string} input - User input to validate
 * @param {Object} options - Validation options
 * @returns {string} - Sanitized input
 */
export const validateAndSanitizeInput = (input, options = {}) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  const {
    maxLength = 1000,
    allowHTML = false,
    stripTags = true
  } = options;
  
  let sanitized = input.trim();
  
  if (!allowHTML && stripTags) {
    sanitized = sanitized.replace(/<[^>]*>/g, '');
  } else if (!allowHTML) {
    sanitized = escapeHTML(sanitized);
  } else {
    sanitized = sanitizeHTML(sanitized);
  }
  
  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
  
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
};

/**
 * Sanitize form data object
 * @param {Object} formData - Form data to sanitize
 * @param {Object} fieldConfigs - Configuration for each field
 * @returns {Object} - Sanitized form data
 */
export const sanitizeFormData = (formData, fieldConfigs = {}) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(formData)) {
    const config = fieldConfigs[key] || {};
    sanitized[key] = validateAndSanitizeInput(value, config);
  }
  
  return sanitized;
};

/**
 * Check if content contains potential XSS patterns
 * @param {string} content - Content to check
 * @returns {boolean} - True if potentially dangerous content is found
 */
export const containsXSS = (content) => {
  if (typeof content !== 'string') {
    return false;
  }
  
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
    /<link/gi,
    /<meta/gi,
    /<style/gi,
    /expression\s*\(/gi,
    /url\s*\(/gi,
    /@import/gi
  ];
  
  return dangerousPatterns.some(pattern => pattern.test(content));
};

/**
 * Safe component for displaying user content
 * @param {string} content - Content to display safely
 * @param {Object} options - Display options
 * @returns {Object} - Safe content object for React
 */
export const createSafeContent = (content, options = {}) => {
  const { allowHTML = false } = options;
  
  if (!content || typeof content !== 'string') {
    return { __html: '' };
  }
  
  if (containsXSS(content)) {
    console.warn('Potentially dangerous content detected and sanitized');
  }
  
  const sanitized = allowHTML ? sanitizeHTML(content) : escapeHTML(content);
  
  return {
    __html: sanitized
  };
};
