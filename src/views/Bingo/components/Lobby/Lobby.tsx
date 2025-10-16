import { useEffect, useRef, useState } from "react";
import { initSocket } from "@/lib/bingo/hook/socket";
import style from "./Lobby.module.scss";
import { ArrowRight } from "lucide-react";
import Button from "@/components/Button/Button";
import Dialog from "@/components/Dialog/Dialog";

interface LobbyProps {
  onJoined: (roomId: string, playerName: string, isHost: boolean) => void;
}

export default function Lobby({ onJoined }: LobbyProps) {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isHosting, setIsHosting] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpenModal]);

  const modalToggle = (modal: boolean, hosting: boolean) => {
    setIsOpenModal(modal);
    setIsHosting(hosting);
  };

  const createRoom = () => {
    const socket = initSocket();
    if (name.trim().length === 0) {
      setError("Name cannot be empty");
      return;
    }
    setIsLoading(true);
    socket.emit("create-room", { name }, (res) => {
      if (res.ok) {
        onJoined(res.roomId, name, true);
        setIsLoading(false);
      }
    });
  };

  const joinRoom = () => {
    const socket = initSocket();
    if (name.trim().length === 0) {
      setError("Name cannot be empty");
      return;
    }
    if (roomId.trim().length === 0) {
      setError("Room ID cannot be empty");
      return;
    }
    setIsLoading(true);
    socket.emit("join-room", { roomId, name }, (res) => {
      if (res.ok) {
        onJoined(roomId, name, false);
        setIsLoading(false);
      } else {
        setError(res.error);
        setIsLoading(false);
      }
    });
  };

  return (
    <div className={style.Lobby}>
      <div className={style.Bingo}>BINGO</div>
      <div className={style.ButtonGroup}>
        <button
          className={style.Button}
          onClick={() => modalToggle(true, true)}
        >
          <p className={style.Text}>Create Room</p>
          <ArrowRight className={style.Icon} />
        </button>
        <button
          className={style.Button}
          onClick={() => modalToggle(true, false)}
        >
          <p className={style.Text}>Join Room</p>
          <ArrowRight className={style.Icon} />
        </button>
      </div>

      {isOpenModal && (
        <div className={style.Modal}>
          <div className={style.ModalContent}>
            <div className={style.Heading}>
              {isHosting ? "Create New Room" : "Join Existed Room"}
            </div>
            <div className={style.InputGroup}>
              <input
                ref={inputRef}
                className={style.Input}
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {!isHosting && (
                <input
                  className={style.Input}
                  placeholder="Room ID"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              )}
              <div className={style.Error}>{error}</div>
            </div>
            <div className={style.ModalButtonGroup}>
              <Button
                title={isHosting ? "Create" : "Join"}
                onClick={isHosting ? createRoom : joinRoom}
                isPrimary={true}
              />
              <Button
                title="Cancel"
                onClick={() => {
                  setIsOpenModal(false);
                  setError("");
                  setName("");
                  setRoomId("");
                }}
                isPrimary={false}
              />
            </div>
          </div>
        </div>
      )}

      <Dialog
        isOpen={isLoading}
        title={isHosting ? "" : ""}
        onClose={() => setIsLoading(false)}
      >
        {isHosting ? "Creating room..." : "Joining room..."}
      </Dialog>
    </div>
  );
}
