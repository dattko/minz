import React from 'react';
import Text from '@/components/text/Text';
import styles from './Input.module.scss';
import { InputWrapProps } from './types';

const InputWrap: React.FC<InputWrapProps> = ({ children, label, required, labelWidth = '60px'
  , labelAlign = 'center'
 }) => {
  return (
    <div className={styles.input__wrap}>
      {label && (
        <label className={`${styles.input__label} ${required ? styles.required : ''}`} style={{minWidth: `${labelWidth}`, textAlign: `${labelAlign}`}}>
          <Text variant='p'>{label}</Text>
        </label>
      )}
        {children}
    </div>
  );
}

export default InputWrap;