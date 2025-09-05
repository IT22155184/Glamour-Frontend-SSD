import PropTypes from 'prop-types';
import { escapeHTML, sanitizeHTML, containsXSS } from '../utils/xssProtection';

const SafeText = ({ 
  content, 
  allowHTML = false, 
  className = '', 
  maxLength = null,
  fallback = '',
  onXSSDetected = null,
  ...props 
}) => {
  if (!content || typeof content !== 'string') {
    return <span className={className} {...props}>{fallback}</span>;
  }

  if (containsXSS(content) && onXSSDetected) {
    onXSSDetected(content);
  }

  let processedContent = content;
  if (maxLength && content.length > maxLength) {
    processedContent = content.substring(0, maxLength) + '...';
  }
  const safeContent = allowHTML 
    ? sanitizeHTML(processedContent) 
    : escapeHTML(processedContent);

  if (allowHTML) {
    return (
      <span 
        className={className}
        {...props}
        dangerouslySetInnerHTML={{ __html: safeContent }}
      />
    );
  }

  return (
    <span className={className} {...props}>
      {safeContent}
    </span>
  );
};

SafeText.propTypes = {
  content: PropTypes.string,
  allowHTML: PropTypes.bool,
  className: PropTypes.string,
  maxLength: PropTypes.number,
  fallback: PropTypes.string,
  onXSSDetected: PropTypes.func,
};

export const SafeInput = ({ 
  value, 
  onChange, 
  className = '',
  onXSSDetected = null,
  ...props 
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (containsXSS(inputValue) && onXSSDetected) {
      onXSSDetected(inputValue);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <input
      {...props}
      value={value || ''}
      onChange={handleChange}
      className={className}
    />
  );
};

SafeInput.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  onXSSDetected: PropTypes.func,
};

export const SafeTextArea = ({ 
  value, 
  onChange, 
  className = '',
  onXSSDetected = null,
  ...props 
}) => {
  const handleChange = (e) => {
    const inputValue = e.target.value;
    
    if (containsXSS(inputValue) && onXSSDetected) {
      onXSSDetected(inputValue);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <textarea
      {...props}
      value={value || ''}
      onChange={handleChange}
      className={className}
    />
  );
};

SafeTextArea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  onXSSDetected: PropTypes.func,
};

export default SafeText;
