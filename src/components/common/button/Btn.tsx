import React from 'react';
import styles from './Btn.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline-primary' | 'outline-secondary';
  size?: 'small' | 'medium' | 'large' | 'icon';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Btn: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const buttonClasses = [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    isLoading ? styles.loading : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >

      {isLoading ? (
        <span className={styles.spinner}></span>
      ) : children}
    </button>
  );
};

export default Btn;