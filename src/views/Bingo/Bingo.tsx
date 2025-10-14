import { useState, useEffect, useCallback } from "react";
import "./Bingo.scss";

// Generate the Bingo board
const generateBoard = () => {
  const columnRanges = [
    [1, 15], // B
    [16, 30], // I
    [31, 45], // N
    [46, 60], // G
    [61, 75], // O
  ];

  const columns = columnRanges.map(([min, max]) => {
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const board = Array.from({ length: 5 }, (_, rowIdx) =>
    columns.map((col) => col[rowIdx])
  );

  // Pick 3 random unique cells for FREE spaces
  const freeSpaces = new Set();
  while (freeSpaces.size < 3) {
    freeSpaces.add(Math.floor(Math.random() * 25)); // positions 0–24
  }

  freeSpaces.forEach((pos) => {
    const r = Math.floor(pos / 5);
    const c = pos % 5;
    board[r][c] = "FREE";
  });

  return { board, freeSpaces };
};

export default function Bingo() {
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [lastNumber, setLastNumber] = useState(null);
  const [boardData, setBoardData] = useState(generateBoard());
  const [board, setBoard] = useState(boardData.board);

  const [marked, setMarked] = useState(
    Array(5)
      .fill()
      .map(() => Array(5).fill(false))
  );
  const [bingo, setBingo] = useState(false);

  // Automatically mark FREE spaces
  useEffect(() => {
    const newMarked = marked.map((row, rIdx) =>
      row.map((_, cIdx) => boardData.freeSpaces.has(rIdx * 5 + cIdx))
    );
    setMarked(newMarked);
  }, [boardData]);

  const toggleCell = (r, c) => {
    const value = board[r][c];

    // Prevent clicking FREE spaces
    if (value === "FREE") return;

    // Prevent marking if number not called yet
    if (!calledNumbers.includes(value)) {
      // Optional: give quick feedback (visual shake or alert)
      console.log(`Number ${value} has not been called yet!`);
      return;
    }

    const newMarked = marked.map((row, i) =>
      row.map((cell, j) => (i === r && j === c ? !cell : cell))
    );
    setMarked(newMarked);
  };

  useEffect(() => {
    const checkBingo = () => {
      const rowBingo = marked.some((row) => row.every(Boolean));
      const colBingo = marked[0].some((_, i) => marked.every((row) => row[i]));
      const diag1 = marked.every((row, i) => row[i]);
      const diag2 = marked.every((row, i) => row[4 - i]);
      setBingo(rowBingo || colBingo || diag1 || diag2);
    };
    checkBingo();
  }, [marked]);

  const resetGame = () => {
    const newBoardData = generateBoard();
    setBoardData(newBoardData);
    setBoard(newBoardData.board);
    setMarked(
      Array(5)
        .fill()
        .map(() => Array(5).fill(false))
    );
    setBingo(false);
  };

  const numberRandomCaller = useCallback(() => {
    if (calledNumbers.length >= 75) {
      alert("All numbers have been called!");
      return;
    }

    let num;
    do {
      num = Math.floor(Math.random() * 75) + 1;
    } while (calledNumbers.includes(num));

    setCalledNumbers((prev) => [...prev, num]);
    setLastNumber(num);
  }, [calledNumbers]);

  useEffect(() => {
    if (!bingo) {
      const result = setTimeout(() => {
        numberRandomCaller();
      }, 3500);

      return () => clearTimeout(result);
    }
  }, [numberRandomCaller]);

  const headers = ["B", "I", "N", "G", "O"];

  return (
    <div className="container">
      <div className="bingo-container">
        {lastNumber && <h2 className="called-number">{lastNumber}</h2>}

        <div className="called-list">
          {calledNumbers.map((n) => (
            <span key={n} className="called-item">
              {n}
            </span>
          ))}
        </div>
      </div>

      <div className="bingo-container">
        <h1 className="bingo-title">🎉 Custom Bingo</h1>

        <div className="bingo-board">
          {headers.map((h) => (
            <div key={h} className="bingo-header">
              {h}
            </div>
          ))}

          {board.map((row, rIdx) =>
            row.map((num, cIdx) => (
              <button
                key={`${rIdx}-${cIdx}`}
                onClick={() => toggleCell(rIdx, cIdx)}
                className={`bingo-cell 
                  ${marked[rIdx][cIdx] ? "marked" : ""} 
                  ${num === "FREE" ? "free" : ""}`}
              >
                {num}
              </button>
            ))
          )}
        </div>

        {bingo && <h2 className="bingo-message">BINGO!</h2>}

        <button onClick={resetGame} className="reset-btn">
          Reset Game
        </button>
      </div>
    </div>
  );
}
