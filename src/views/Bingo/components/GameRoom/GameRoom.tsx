import { useEffect, useState } from "react";
import { getSocket, initSocket } from "@/lib/bingo/hook/socket";
import type { Player } from "@/lib/bingo/hook/socket";
import Board from "../Board/Board";
import style from "./GameRoom.module.scss";
import Dialog from "@/components/Dialog/Dialog";
import clsx from "clsx";
import useIsMobile from "@/utils/hooks/useIsMobile";

interface GameRoomProps {
  roomId: string;
  playerName: string;
  isHost: boolean;
}

export default function GameRoom({
  roomId,
  playerName,
  isHost,
}: GameRoomProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isMobile = useIsMobile();

  const calledNumbersToShow = isMobile ? 12 : 24;

  useEffect(() => {
    const socket = initSocket();
    socket.emit("join-room", { roomId, name: playerName }, (res) => {
      if (!res.ok) alert(res.error);
    });

    socket.on("player-list", setPlayers);
    socket.on("number-called", (num) =>
      setCalledNumbers((prev) => [...prev, num])
    );
    socket.on("bingo-claimed", ({ name }) => setWinner(name));

    return () => {
      socket.off("player-list");
      socket.off("number-called");
      socket.off("bingo-claimed");
    };
  }, [roomId, playerName]);

  const callRandom = () => {
    const socket = getSocket();
    const random = Math.floor(Math.random() * 75) + 1;
    socket?.emit("call-number", { roomId, number: random }, (res) => {
      if (!res.ok) alert(res.error);
    });
  };

  const replayGame = () => {
    setCalledNumbers([]);
    setWinner(null);
    setIsDialogOpen(false);
    // Optionally emit to server if needed: socket?.emit("reset-game", { roomId });
  };

  const claimBingo = () => {
    const socket = getSocket();
    socket?.emit("claim-bingo", { roomId }, (res) => {
      if (!res.ok) {
        alert(res.error);
        return;
      }
      setWinner(playerName);
      setIsDialogOpen(true);
    });
  };

  return (
    <main className={style.GameRoom}>
      <h2 className={style.Heading}>Room ID: {roomId}</h2>
      <div className={style.Players}>
        Players:
        <div className={style.PlayerList}>
          {players.map((item) => (
            <div key={item.id} className={style.Player}>
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className={style.GameControl}>
        {isHost && (
          <button className={style.CallButton} onClick={callRandom}>
            Call Number
          </button>
        )}
        {calledNumbers.length > 0 ? (
          <div className={style.NumberList}>
            {calledNumbers
              .slice()
              .reverse()
              .slice(0, calledNumbersToShow)
              .map((num, index) => (
                <div
                  key={index}
                  className={clsx(style.Number, index === 0 && style.Latest)}
                >
                  {num}
                </div>
              ))}
          </div>
        ) : (
          <>
            {isHost ? (
              <div className={style.StartGame}>
                Call a number to start the game
              </div>
            ) : (
              <div className={style.StartGame}>
                Waiting for host to call a number...
              </div>
            )}
          </>
        )}
      </div>

      <div className={style.BoardContainer}>
        <Board roomId={roomId} calledNumbers={calledNumbers} />
      </div>

      {!winner && (
        <button className={style.BingoButton} onClick={claimBingo}>
          Claim Bingo 🎉
        </button>
      )}

      <Dialog
        title="Bingoooooo!"
        onClose={() => {
          setIsDialogOpen(false);
          setWinner(null);
        }}
        isOpen={isDialogOpen || winner !== null}
      >
        <p>🎉 {winner} won!</p>
        <button className={style.ReplayButton} onClick={replayGame}>
          Play Again
        </button>
      </Dialog>
    </main>
  );
}
