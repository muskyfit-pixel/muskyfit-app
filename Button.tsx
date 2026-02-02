
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-5 font-black uppercase tracking-[0.2em] transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:active:scale-100 flex items-center justify-center gap-2 text-[12px] rounded-none";
  
  const variants = {
    primary: "bg-musky-teal text-black border-2 border-musky-teal hover:bg-white hover:text-black hover:border-white",
    secondary: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black",
    danger: "bg-transparent text-red-500 border-2 border-red-500",
    ghost: "bg-transparent text-white opacity-60 hover:opacity-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
