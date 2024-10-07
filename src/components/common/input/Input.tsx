'use client';
import React, { useState } from 'react';
import styles from './Input.module.scss';
import { InputProps } from './types';
import Text from '@/components/text/Text';


const Input: React.FC<InputProps> = ({
  type = 'text',
  btnTitle,
  btnClick,
  error,
  helperText,
  icon,
  className,
  inputClassName,
  disabled,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`${styles.input__box} ${className} ${disabled ? styles.disabled : ''}`}>
      <div className={`${styles.input__field} ${isFocused ? styles.focused : ''} ${error ? styles.error : ''}`}>
        <input
          type={type}
          className={`${styles.input} ${inputClassName}`}
          disabled={disabled}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {btnTitle && (
          <button onClick={btnClick} className={styles.input__btn} type="button">
            {btnTitle}
          </button>
        )}
      </div>
      {helperText && <p className={`${styles.helperText} ${error ? styles.errorText : ''}`}>{helperText}</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default Input;