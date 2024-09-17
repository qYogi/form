import { Menu } from "./Menu/Menu";
import { GameBoard } from "./GameBoard/GameBoard";
import "./TicTacToe.css";
import { useState } from "react";
export const TicTacToe = () => {
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [activeScreen, setActiveScreen] = useState(0);
  const screens = [Menu, GameBoard];

  const CurrentScreen = screens[activeScreen];

  function handleScreenChange() {
    setActiveScreen((prev) => (prev + 1) % screens.length);
  }

  return (
    <div className="XOContainer">
      <CurrentScreen
        currentPlayer={currentPlayer}
        setCurrentPlayer={setCurrentPlayer}
        handleScreenChange={handleScreenChange}
      />
    </div>
  );
};
