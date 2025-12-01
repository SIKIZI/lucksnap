"use client";

import { useState } from "react";
import NumberPicker from "./components/NumberPicker";

const generateLottoNumbers = (): number[] => {
  const numbers: Set<number> = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

export default function Home() {
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<string[]>(Array(5).fill(""));
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);

  const handleGenerate = () => {
    setGeneratedNumbers(generateLottoNumbers());
  };

  const handleUserNumberChange = (index: number, value: string) => {
    const newUserNumbers = [...userNumbers];
    newUserNumbers[index] = value;
    setUserNumbers(newUserNumbers);
  };

  const handleNumberPick = (number: number) => {
    const newUserNumbers = [...userNumbers];
    const currentNumbers =
      userNumbers[activeInputIndex] === ""
        ? []
        : userNumbers[activeInputIndex]
            .split(",")
            .map((n) => parseInt(n.trim(), 10));

    if (currentNumbers.includes(number)) {
      // Remove number
      const updatedNumbers = currentNumbers.filter((n) => n !== number);
      newUserNumbers[activeInputIndex] = updatedNumbers.join(", ");
    } else {
      // Add number
      if (currentNumbers.length < 6) {
        const updatedNumbers = [...currentNumbers, number].sort(
          (a, b) => a - b
        );
        newUserNumbers[activeInputIndex] = updatedNumbers.join(", ");
      }
    }
    setUserNumbers(newUserNumbers);
  };

  const handleSimulate = () => {
    const newWinningNumbers = generateLottoNumbers();
    setWinningNumbers(newWinningNumbers);

    const newResults = userNumbers
      .filter((line) => line.trim() !== "") // Ignore empty lines
      .map((line) => {
        const userSet = line.split(",").map((num) => parseInt(num.trim(), 10));
        if (userSet.length !== 6 || userSet.some(isNaN)) {
          return "오류: 6개의 숫자를 쉼표로 구분하여 입력하세요.";
        }
        const matchedNumbers = userSet.filter((num) =>
          newWinningNumbers.includes(num)
        );
        if (matchedNumbers.length === 6) {
          return `축하합니다! 1등입니다! 실제 로또에서도 행운을 빕니다! (일치하는 번호: ${matchedNumbers.join(
            ", "
          )})`;
        } else if (matchedNumbers.length === 5) {
          return `축하합니다! 2등입니다! (일치하는 번호: ${matchedNumbers.join(
            ", "
          )})`;
        } else if (matchedNumbers.length === 4) {
          return `축하합니다! 3등입니다! (일치하는 번호: ${matchedNumbers.join(
            ", "
          )})`;
        } else if (matchedNumbers.length === 3) {
          return `축하합니다! 4등입니다! (일치하는 번호: ${matchedNumbers.join(
            ", "
          )})`;
        }
        return `아쉽지만 다음 기회에! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      });

    setResults(newResults);
  };

  const getSelectedNumbers = (index: number): number[] => {
    if (userNumbers[index] === "") {
      return [];
    }
    return userNumbers[index].split(",").map((n) => parseInt(n.trim(), 10));
  };

  return (
    <div className="container">
      <h1>로또 번호 생성 및 시뮬레이션</h1>

      <div className="lotto-section">
        <h2>번호 생성기</h2>
        <button className="button" onClick={handleGenerate}>
          새 번호 생성
        </button>
        {generatedNumbers.length > 0 && (
          <div className="lotto-numbers">
            {generatedNumbers.map((num, i) => (
              <div key={i} className="lotto-number">
                {num}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lotto-section">
        <h2>모의 추첨</h2>
        <p>아래 숫자판을 클릭하여 6개의 숫자를 선택하세요.</p>
        <NumberPicker
          onNumberClick={handleNumberPick}
          selectedNumbers={getSelectedNumbers(activeInputIndex)}
        />
        {userNumbers.map((line, i) => (
          <div key={i} className="input-group">
            <label>로또 번호 세트 {i + 1}:</label>
            <input
              type="text"
              value={line}
              onFocus={() => setActiveInputIndex(i)}
              readOnly
              onChange={(e) => handleUserNumberChange(i, e.target.value)}
              placeholder="숫자판을 이용해 번호를 선택하세요"
            />
          </div>
        ))}
        <button className="button" onClick={handleSimulate}>
          추첨 시작
        </button>
      </div>

      {winningNumbers.length > 0 && (
        <div className="result-section">
          <h2>추첨 결과</h2>
          <div className="winning-numbers">
            <p className="result-text">
              <strong>당첨 번호:</strong>
            </p>
            <div className="lotto-numbers">
              {winningNumbers.map((num, i) => (
                <div key={i} className="lotto-number">
                  {num}
                </div>
              ))}
            </div>
          </div>
          <div className="user-results">
            {results.map((result, i) => (
              <p key={i} className="result-text">
                <strong>세트 {i + 1}:</strong> {result}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
