import React from 'react';

const Button = ({ children, onClick, type = "button", className = "", styleType = "primary" }) => {
  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${className}`}
      style={{
        width: '100%',
        padding: '15px',
        borderRadius: '15px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: '0.3s',
        backgroundColor: styleType === 'primary' ? 'var(--primary-color)' : 'transparent',
        color: 'white',
        boxShadow: styleType === 'primary' ? 'var(--shadow-btn)' : 'none',
      }}
    >
      {children}
    </button>
  );
};

export default Button;