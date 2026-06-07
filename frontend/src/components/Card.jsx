import React from 'react';

const Card = ({ children, className = '', glass = false }) => {
  const baseClass = glass ? 'glass-panel' : 'bg-white shadow-md border border-gray-100 rounded-lg';
  return (
    <div className={`${baseClass} p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
