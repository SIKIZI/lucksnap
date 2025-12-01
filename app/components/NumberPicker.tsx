"use client";

import React from "react";

interface NumberPickerProps {
  onNumberClick: (number: number) => void;
  selectedNumbers: number[];
}

const NumberPicker: React.FC<NumberPickerProps> = ({
  onNumberClick,
  selectedNumbers,
}) => {
  const numbers = Array.from({ length: 45 }, (_, i) => i + 1);

  return (
    <div className="number-picker">
      {numbers.map((number) => (
        <button
          key={number}
          onClick={() => onNumberClick(number)}
          className={`number-button ${
            selectedNumbers.includes(number) ? "selected" : ""
          }`}
          disabled={
            selectedNumbers.length >= 6 && !selectedNumbers.includes(number)
          }
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default NumberPicker;
