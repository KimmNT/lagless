import { io, Socket } from "socket.io-client";

export interface Cell {
  number: number;
  markedBy?: string | null;
}

export interface Player {
  id: string;
  name: string;
  board: Cell[][];
}

export interface Game {
  id: string;
  hostId: string;
  players: Player[];
  calledNumbers: number[];
  started: boolean;
  winnerId?: string;
}

export type ServerToClientEvents = {
  "player-list": (players: Player[]) => void;
  "player-joined": (player: Player) => void;
  "player-left": (id: string) => void;
  "game-started": () => void;
  "number-called": (number: number) => void;
  "player-marked": (payload: {
    playerId: string;
    row: number;
    col: number;
  }) => void;
  "bingo-claimed": (payload: { winnerId: string; name: string }) => void;
};

export type ClientToServerEvents = {
  "create-room": (data: { name: string }, cb: (res: any) => void) => void;
  "join-room": (
    data: { roomId: string; name: string },
    cb: (res: any) => void
  ) => void;
  "start-game": (data: { roomId: string }, cb: (res: any) => void) => void;
  "call-number": (
    data: { roomId: string; number: number },
    cb: (res: any) => void
  ) => void;
  "mark-cell": (
    data: { roomId: string; row: number; col: number },
    cb: (res: any) => void
  ) => void;
  "claim-bingo": (data: { roomId: string }, cb: (res: any) => void) => void;
};

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const initSocket = () => {
  if (!socket) {
    // socket = io("http://localhost:4000");
    socket = io("https://lagless-socket.onrender.com");
  }
  return socket;
};

export const getSocket = () => socket;
