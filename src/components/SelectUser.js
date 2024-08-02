import React from 'react';
import styles from '../styles/SelectUser.module.css';

const SelectUser = ({ label, value, onChange, options }) => {
  return (
    <div className={styles.selectContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <select className={styles.select} value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectUser;
