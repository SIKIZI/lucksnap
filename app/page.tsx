"use client";

import { useState, useEffect } from "react";
import NumberPicker from "./components/NumberPicker";

const generateLottoNumbers = (): number[] => {
  const numbers: Set<number> = new Set();
  while (numbers.size < 6) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }
  return Array.from(numbers).sort((a, b) => a - b);
};

const getBallColor = (number: number): string => {
  if (number <= 10) return "ball-yellow";
  if (number <= 20) return "ball-blue";
  if (number <= 30) return "ball-red";
  if (number <= 40) return "ball-green";
  return "ball-purple";
};

export default function Home() {
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [userNumbers, setUserNumbers] = useState<string[]>(Array(5).fill(""));
  const [winningNumbers, setWinningNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);
  const [balance, setBalance] = useState<number>(20000);
  const [purchasedSlots, setPurchasedSlots] = useState<boolean[]>(
    Array(5).fill(false)
  );
  const [timeUntilCharge, setTimeUntilCharge] = useState<number>(60);

  useEffect(() => {
    const savedBalance = localStorage.getItem("balance");
    const savedUserNumbers = localStorage.getItem("userNumbers");
    const savedGeneratedNumbers = localStorage.getItem("generatedNumbers");
    const savedPurchasedSlots = localStorage.getItem("purchasedSlots");

    if (savedBalance) {
      setBalance(parseInt(savedBalance, 10));
    }
    if (savedUserNumbers) {
      setUserNumbers(JSON.parse(savedUserNumbers));
    }
    if (savedGeneratedNumbers) {
      setGeneratedNumbers(JSON.parse(savedGeneratedNumbers));
    }
    if (savedPurchasedSlots) {
      setPurchasedSlots(JSON.parse(savedPurchasedSlots));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("balance", balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem("userNumbers", JSON.stringify(userNumbers));
  }, [userNumbers]);

  useEffect(() => {
    localStorage.setItem("generatedNumbers", JSON.stringify(generatedNumbers));
  }, [generatedNumbers]);

  useEffect(() => {
    localStorage.setItem("purchasedSlots", JSON.stringify(purchasedSlots));
  }, [purchasedSlots]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prevBalance) => prevBalance + 500);
      setTimeUntilCharge(60); // 충전 후 타이머 리셋
    }, 60000);

    const timer = setInterval(() => {
      setTimeUntilCharge((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  const handleGenerate = () => {
    if (balance >= 5000) {
      setBalance(balance - 5000);
      setGeneratedNumbers(generateLottoNumbers());
    } else {
      alert("잔액이 부족합니다. 1분마다 500원씩 충전됩니다.");
    }
  };

  const handleUserNumberChange = (index: number, value: string) => {
    const newUserNumbers = [...userNumbers];
    newUserNumbers[index] = value;
    setUserNumbers(newUserNumbers);
  };

  const handleNumberPick = (number: number) => {
    // 현재 슬롯이 구매되지 않았으면 경고
    if (!purchasedSlots[activeInputIndex]) {
      alert("먼저 이 슬롯의 복권을 구매해주세요. (5,000원)");
      return;
    }

    const newUserNumbers = [...userNumbers];
    const currentNumbers =
      userNumbers[activeInputIndex] === ""
        ? []
        : userNumbers[activeInputIndex]
            .split(",")
            .map((n) => parseInt(n.trim(), 10))
            .filter((n) => !isNaN(n));

    if (currentNumbers.includes(number)) {
      const updatedNumbers = currentNumbers.filter((n) => n !== number);
      newUserNumbers[activeInputIndex] = updatedNumbers.join(", ");
    } else {
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
    // 구매한 번호가 있는지 확인
    const hasPurchasedNumbers =
      generatedNumbers.length === 6 ||
      userNumbers.some(
        (line) =>
          line
            .split(",")
            .map(Number)
            .filter((n) => !isNaN(n)).length === 6
      );

    if (!hasPurchasedNumbers) {
      alert(
        "복권을 구매해야 추첨이 가능합니다. 랜덤 복권을 구매하거나 수동으로 번호를 선택하세요."
      );
      return;
    }

    const newWinningNumbers = generateLottoNumbers();
    setWinningNumbers(newWinningNumbers);

    const newResults = userNumbers
      .filter((line) => line.trim() !== "")
      .map((line) => {
        const userSet = line
          .split(",")
          .map((num) => parseInt(num.trim(), 10))
          .filter((n) => !isNaN(n));
        if (userSet.length !== 6) {
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

    if (generatedNumbers.length === 6) {
      const matchedNumbers = generatedNumbers.filter((num) =>
        newWinningNumbers.includes(num)
      );
      let resultText;
      if (matchedNumbers.length === 6) {
        resultText = `(랜덤 생성) 축하합니다! 1등입니다! 실제 로또에서도 행운을 빕니다! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      } else if (matchedNumbers.length === 5) {
        resultText = `(랜덤 생성) 축하합니다! 2등입니다! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      } else if (matchedNumbers.length === 4) {
        resultText = `(랜덤 생성) 축하합니다! 3등입니다! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      } else if (matchedNumbers.length === 3) {
        resultText = `(랜덤 생성) 축하합니다! 4등입니다! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      } else {
        resultText = `(랜덤 생성) 아쉽지만 다음 기회에! (일치하는 번호: ${matchedNumbers.join(
          ", "
        )})`;
      }
      setResults((prevResults) => [resultText, ...newResults]);
    } else {
      setResults(newResults);
    }

    // 추첨 후 모든 번호 리셋
    setGeneratedNumbers([]);
    setUserNumbers(Array(5).fill(""));
    setPurchasedSlots(Array(5).fill(false));
  };

  const getSelectedNumbers = (index: number): number[] => {
    if (userNumbers[index] === "") {
      return [];
    }
    return userNumbers[index]
      .split(",")
      .map((n) => parseInt(n.trim(), 10))
      .filter((n) => !isNaN(n));
  };

  const canSimulate =
    generatedNumbers.length === 6 ||
    userNumbers.some(
      (line) =>
        line
          .split(",")
          .map(Number)
          .filter((n) => !isNaN(n)).length === 6
    );

  return (
    <div className="container">
      <div className="balance-display">
        <div>잔액: {balance.toLocaleString()}원</div>
        <div style={{ fontSize: "14px", color: "#666", marginTop: "5px" }}>
          다음 충전까지: {timeUntilCharge}초 (500원 충전)
        </div>
      </div>
      <h1>로또 번호 생성 및 시뮬레이션</h1>

      <div className="lotto-section">
        <h2>랜덤 복권 구매</h2>
        <button
          className="button"
          onClick={handleGenerate}
          disabled={balance < 5000}
        >
          복권 구매 (5,000원)
        </button>
        {generatedNumbers.length > 0 && (
          <div className="lotto-numbers">
            {generatedNumbers.map((num, i) => (
              <div key={i} className={`lotto-number ${getBallColor(num)}`}>
                {num}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="lotto-section">
        <h2>수동 번호 선택</h2>
        <p>아래 숫자판을 클릭하여 6개의 숫자를 선택하세요.</p>
        {userNumbers.map((line, i) => (
          <div key={i} className="input-group">
            <label>내 번호 세트 {i + 1}:</label>
            <button
              className="button"
              onClick={() => {
                if (balance >= 5000) {
                  setBalance(balance - 5000);
                  const newPurchasedSlots = [...purchasedSlots];
                  newPurchasedSlots[i] = true;
                  setPurchasedSlots(newPurchasedSlots);
                  setActiveInputIndex(i);
                } else {
                  alert("잔액이 부족합니다. 1분마다 500원씩 충전됩니다.");
                }
              }}
              disabled={purchasedSlots[i] || balance < 5000}
              style={{ marginRight: "10px" }}
            >
              {purchasedSlots[i] ? "구매완료" : "복권 구매 (5,000원)"}
            </button>
            <input
              type="text"
              value={line}
              onFocus={() => {
                if (purchasedSlots[i]) {
                  setActiveInputIndex(i);
                } else {
                  alert("먼저 이 슬롯의 복권을 구매해주세요.");
                }
              }}
              readOnly
              onChange={(e) => handleUserNumberChange(i, e.target.value)}
              placeholder={
                purchasedSlots[i]
                  ? "숫자판을 이용해 번호를 선택하세요"
                  : "복권을 구매하세요"
              }
            />
          </div>
        ))}
        <NumberPicker
          onNumberClick={handleNumberPick}
          selectedNumbers={getSelectedNumbers(activeInputIndex)}
        />
        <button
          className="button"
          onClick={handleSimulate}
          disabled={!canSimulate}
        >
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
                <div key={i} className={`lotto-number ${getBallColor(num)}`}>
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
