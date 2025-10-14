import { useState, useEffect, useCallback } from "react";
import "./Bingo.scss";

type BoardValue = number | "FREE";
type Board = BoardValue[][];
type Marked = boolean[][];

interface BoardData {
  board: Board;
  freeSpaces: Set<number>;
}

const generateBoard = (): BoardData => {
  const columnRanges: [number, number][] = [
    [1, 20], // B
    [21, 40], // I
    [41, 60], // N
    [61, 80], // G
    [81, 100], // O
  ];

  const columns = columnRanges.map(([min, max]) => {
    const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    const shuffled = numbers.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const board: Board = Array.from({ length: 5 }, (_, rowIdx) =>
    columns.map((col) => col[rowIdx])
  );

  // Pick 3 random free spots
  const freeSpaces = new Set<number>();
  while (freeSpaces.size < 3) {
    freeSpaces.add(Math.floor(Math.random() * 25));
  }

  freeSpaces.forEach((pos) => {
    const r = Math.floor(pos / 5);
    const c = pos % 5;
    board[r][c] = "FREE";
  });

  return { board, freeSpaces };
};

export default function Bingo() {
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [boardData, setBoardData] = useState<BoardData>(generateBoard());
  const [board, setBoard] = useState<Board>(boardData.board);
  const [marked, setMarked] = useState<Marked>(
    Array.from({ length: 5 }, () => Array(5).fill(false))
  );
  const [bingo, setBingo] = useState(false);

  // Automatically mark free spaces
  useEffect(() => {
    const newMarked: Marked = marked.map((row, rIdx) =>
      row.map((_, cIdx) => boardData.freeSpaces.has(rIdx * 5 + cIdx))
    );
    setMarked(newMarked);
  }, [boardData]);

  const toggleCell = (r: number, c: number) => {
    const value = board[r][c];
    // const cellId = `${r}-${c}`;

    // Prevent FREE spaces from toggling
    if (value === "FREE") return;

    // Prevent marking uncalled numbers
    // if (!calledNumbers.includes(value)) {
    //   const cell = document.querySelector<HTMLButtonElement>(
    //     `[data-cell="${cellId}"]`
    //   );
    //   if (cell) {
    //     cell.classList.add("invalid");
    //     setTimeout(() => cell.classList.remove("invalid"), 200);
    //   }
    //   return;
    // }

    const newMarked = marked.map((row, i) =>
      row.map((cell, j) => (i === r && j === c ? !cell : cell))
    );
    setMarked(newMarked);
  };

  // Check Bingo whenever marked changes
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
    setMarked(Array.from({ length: 5 }, () => Array(5).fill(false)));
    setBingo(false);
    setCalledNumbers([]);
    setLastNumber(null);
  };

  const numberRandomCaller = useCallback(() => {
    if (calledNumbers.length >= 100) {
      alert("All numbers have been called!");
      return;
    }

    let num: number;
    do {
      num = Math.floor(Math.random() * 100) + 1;
    } while (calledNumbers.includes(num));

    setCalledNumbers((prev) => [...prev, num]);
    setLastNumber(num);
  }, [calledNumbers]);

  // Auto-call a number every few seconds
  // useEffect(() => {
  //   const result = setTimeout(() => {
  //     numberRandomCaller();
  //   }, 3500);
  //   return () => clearTimeout(result);
  // }, [numberRandomCaller]);

  const headers = ["B", "I", "N", "G", "O"];

  return (
    <div className="container">
      <div className="bingo-container">
        <h1 className="bingo-title">🎱 Bingo Caller</h1>

        <button className="call-btn" onClick={numberRandomCaller}>
          Call Next Number
        </button>

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
                data-cell={`${rIdx}-${cIdx}`}
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
