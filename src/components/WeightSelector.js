import React from 'react';

const WeightSelector = ({ weight, onWeightChange }) => {
    return (
        <div>
            <label htmlFor="weight">Peso (gramos): </label>
            <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => onWeightChange(e.target.value)}
            />
        </div>
    );
};

export default WeightSelector;
