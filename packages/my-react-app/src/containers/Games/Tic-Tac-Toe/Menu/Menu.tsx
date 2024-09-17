import style from "./Menu.module.css";
import { IconO } from "../SVGs/IconO.tsx";
import { XnO } from "../SVGs/XnO.tsx";
import { IconX } from "../SVGs/IconX.tsx";
import { useState } from "react";

export interface Props {
  currentPlayer: string;
  setCurrentPlayer: (player: string) => void;
  handleScreenChange: () => void;
}

export const Menu: React.FC<Props> = ({
  currentPlayer,
  setCurrentPlayer,
  handleScreenChange,
}: Props) => {
  const [disabled, setDisabled] = useState(false);

  const handlePlayerMark = (player: string) => {
    setCurrentPlayer(player);
    setDisabled(true);
  };

  console.log("currentPlayer", currentPlayer);

  const handleSubmit = () => {
    handleScreenChange();
  };

  return (
    <div className={style.menu}>
      <div className={style.XnO}>
        <XnO />
      </div>

      <div className={style.playerMark}>
        <h3>PICK PLAYER'S 1 MARK</h3>
        <div className={style.playerMarkBtn}>
          <button
            id="X"
            className={`${style.X} ${currentPlayer === "X" ? style.active : ""}`}
            onClick={() => handlePlayerMark("X")}
          >
            <IconX />
          </button>
          <button
            id="O"
            className={`${style.O} ${currentPlayer === "O" ? style.active : ""}`}
            onClick={() => handlePlayerMark("O")}
          >
            <IconO />
          </button>
        </div>
        <h5>Good luck &#128521;</h5>
      </div>

      <div className={style.newGameBtn}>
        <button id={style.CPU} disabled={disabled}>
          NEW GAME (VS CPU)
        </button>
        <br />
        <button type="submit" onClick={handleSubmit} id={style.Player}>
          NEW GAME (VS PLAYER)
        </button>
      </div>
    </div>
  );
};
