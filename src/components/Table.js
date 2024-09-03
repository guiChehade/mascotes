import React from 'react';
import styles from '../styles/Table.module.css';

const Table = ({ headers, data }) => {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={styles.tableHeader}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className={styles.tableRow}>
              {Object.values(row).map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.tableCell}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
