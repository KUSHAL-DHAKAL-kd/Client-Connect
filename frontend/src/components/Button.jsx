import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', // 'primary', 'outline', 'ghost'
  className = '', 
  icon: Icon,
  ...props 
}) => {
  const baseClass = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ease-in-out cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm button-primary",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-50 button-outline",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
  };

  const cssVariant = variants[variant] || variants.primary;

  return (
    <button className={`${baseClass} ${cssVariant} ${className}`} {...props}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

export default Button;
