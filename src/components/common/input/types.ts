import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type?: string;
  btnTitle?: string;
  btnClick?: () => void;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  inputClassName?: string;
  labelWidth?: string;
  labelAlign?: 'left' | 'right' | 'center';
}

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
}