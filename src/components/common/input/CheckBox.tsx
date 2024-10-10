import React, { forwardRef } from 'react';
import styles from './CheckBox.module.scss';
import { CheckboxProps } from './types';
import Text from '@/components/text/Text';
import { CircleCheck } from 'lucide-react';


const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, onChange, disabled, error, className, ...props }, ref) => {
    const id = props.id || `checkbox-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className={`${styles.checkbox__Wrap} ${className || ''}`}>
        <label className={`${styles.label} ${disabled ? styles.disabled : ''}`}>
          <input
            type="checkbox"
            ref={ref}
            id={id}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={styles.input}
            {...props}
          />
          <CircleCheck className={styles.checkbox}></CircleCheck>
          <Text fontSize='xs' variant='p' color='gray'>{label}</Text>
        </label>
        {error && <Text variant='p' fontSize='sm'>{error}</Text>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;