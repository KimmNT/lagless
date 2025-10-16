import { useState } from "react";
import { getSocket } from "@/lib/bingo/hook/socket";
import type { Cell } from "@/lib/bingo/hook/socket";
import style from "./Board.module.scss";
import clsx from "clsx";

interface BoardProps {
  roomId: string;
  calledNumbers: number[];
}

const generateLocalBoard = (): Cell[][] => {
  const ranges = [
    [1, 15],
    [16, 30],
    [31, 45],
    [46, 60],
    [61, 75],
  ];
  const board = Array.from({ length: 5 }, () => Array(5).fill(null));
  for (let col = 0; col < 5; col++) {
    const [min, max] = ranges[col];
    const nums = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    for (let row = 0; row < 5; row++) {
      const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
      board[row][col] = { number: num, markedBy: null };
    }
  }
  board[2][2].markedBy = "free";
  return board;
};

export default function Board({ roomId, calledNumbers }: BoardProps) {
  const [board, setBoard] = useState<Cell[][]>(generateLocalBoard());

  const handleClick = (r: number, c: number) => {
    const cellNumber = board[r][c].number;
    if (!calledNumbers.includes(cellNumber)) {
      return;
    }
    const socket = getSocket();
    socket?.emit("mark-cell", { roomId, row: r, col: c }, (res) => {
      if (!res.ok) alert(res.error);
      else {
        setBoard((prev) => {
          const next = prev.map((row) => row.map((cell) => ({ ...cell })));
          const cell = next[r][c];
          cell.markedBy = cell.markedBy ? null : "you";
          return next;
        });
      }
    });
  };

  return (
    <div className={style.Board}>
      {board.map((row, ri) =>
        row.map((cell, ci) => (
          <button
            key={`${ri}-${ci}`}
            onClick={() => handleClick(ri, ci)}
            className={clsx(style.Cell, {
              [style.Free]: cell.markedBy === "free",
              [style.Marked]: cell.markedBy && cell.markedBy !== "free",
            })}
            disabled={cell.markedBy === "free" || !!cell.markedBy}
          >
            {cell.markedBy === "free" ? "★" : cell.number}
          </button>
        ))
      )}
    </div>
  );
}
