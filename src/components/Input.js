import React from 'react';
import styles from '../styles/Input.module.css';

const applyMask = (value, mask) => {
  if (!mask) return value;

  const unmaskedValue = value.replace(/\D/g, '');
  let maskedValue = '';
  let maskIndex = 0;
  let valueIndex = 0;

  while (maskIndex < mask.length && valueIndex < unmaskedValue.length) {
    if (mask[maskIndex] === '9') {
      maskedValue += unmaskedValue[valueIndex];
      valueIndex++;
    } else {
      maskedValue += mask[maskIndex];
    }
    maskIndex++;
  }

  return maskedValue;
};

const Input = ({ label, type, name, value, onChange, placeholder, required, mask }) => {
  const handleChange = (e) => {
    const maskedValue = applyMask(e.target.value, mask);
    onChange({ target: { name, value: maskedValue } });
  };

  return (
    <div className={styles.inputContainer}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;