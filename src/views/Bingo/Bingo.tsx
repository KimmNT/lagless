import { useState } from "react";
import Lobby from "./components/Lobby/Lobby";
import GameRoom from "./components/GameRoom/GameRoom";
import style from "./Bingo.module.scss";
// import Navbar from "@/layout/Navbar/Navbar";

export default function App() {
  const [roomId, setRoomId] = useState<string | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);

  return (
    <>
      {/* <Navbar /> */}
      <main className={style.Container}>
        {!roomId ? (
          <Lobby
            onJoined={(id, name, host) => {
              setRoomId(id);
              setPlayerName(name);
              setIsHost(host);
            }}
          />
        ) : (
          <GameRoom roomId={roomId} playerName={playerName} isHost={isHost} />
        )}
      </main>
    </>
  );
}
