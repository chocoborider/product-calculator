import React from 'react';
import styles from './WeightSelector.module.css';

const WeightSelector = ({ weight, onWeightChange, weightStep }) => {
  const handleIncrement = () => {
      onWeightChange(weight + weightStep);
  };

  const handleDecrement = () => {
      if (weight - weightStep >= 0) {
          onWeightChange(weight - weightStep);
      }
  };

  return (
    <div className={styles.weightSelector}>
        <button className={styles.button} onClick={handleDecrement}>-</button>
        <input
            type="number"
            className={styles.weightInput}
            value={weight}
            readOnly
        />
        <button className={styles.button} onClick={handleIncrement}>+</button>
    </div>
);
};

export default WeightSelector;
