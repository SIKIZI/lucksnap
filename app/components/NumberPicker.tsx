interface NumberPickerProps {
  onNumberClick: (number: number) => void;
  selectedNumbers: number[];
}

export default function NumberPicker({
  onNumberClick,
  selectedNumbers,
}: NumberPickerProps) {
  return (
    <div className="number-grid-container">
      <div className="number-grid">
        {Array.from({ length: 45 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className={`number-button ${
              selectedNumbers.includes(num) ? "selected" : ""
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <style jsx>{`
        .number-grid-container {
          width: 100%;
          margin: 20px 0;
        }

        .number-grid {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          gap: 10px;
          max-width: 100%;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .number-button {
          width: 100%;
          aspect-ratio: 1;
          min-width: 50px;
          min-height: 50px;
          border: none;
          border-radius: 50%;
          background: white;
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .number-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          background: #e3f2fd;
        }

        .number-button.selected {
          background: #2196f3;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
        }

        .number-button:active {
          transform: scale(0.95);
        }

        @media (max-width: 768px) {
          .number-grid {
            grid-template-columns: repeat(9, 1fr);
            gap: 8px;
            padding: 15px;
          }

          .number-button {
            min-width: 40px;
            min-height: 40px;
            font-size: 16px;
          }
        }

        @media (max-width: 480px) {
          .number-grid {
            grid-template-columns: repeat(6, 1fr);
            gap: 6px;
            padding: 10px;
          }

          .number-button {
            min-width: 35px;
            min-height: 35px;
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
