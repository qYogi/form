import style from "./GameBoard.module.css";
import { IconX } from "../SVGs/IconX.tsx";
import { IconO } from "../SVGs/IconO.tsx";
import { IconRestart } from "../SVGs/IconRestart.tsx";
import { XnO } from "../SVGs/XnO.tsx";
import { useState } from "react";
import { Modal } from "react-bootstrap";
interface Props {
  currentPlayer: string;
  setCurrentPlayer: (player: string) => void;
  handleScreenChange: () => void;
}

export const GameBoard: React.FC<Props> = ({
  currentPlayer,
  setCurrentPlayer,
  handleScreenChange,
}: Props) => {
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<string | null>(null);
  const [initialPlayer, setInitialPlayer] = useState<string>(currentPlayer);
  const [gameBoard, setGameBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ]);

  const [score, setScore] = useState({
    X: 0,
    O: 0,
    Draw: 0,
  });

  //winning combinations

  const handleRestart = () => {
    setGameBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setGameOver(false);
    setCurrentPlayer("X");
    setDisabled(false);
    handleScreenChange();
  };

  const handleMove = (row: number, col: number) => {
    if (gameBoard[row][col] || gameOver) return;

    const newBoard = [...gameBoard];
    newBoard[row][col] = currentPlayer;
    setGameBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      handleWinner(winner);
      setCurrentWinner(winner);
      setInitialPlayer(winner);
      console.log("winner", winner);
    } else if (newBoard.flat().every((cell) => cell)) {
      handleDraw();
      setCurrentWinner("Draw");
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const checkWinner = (board: string[][]) => {
    const winPatterns = [
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ], //rows
      [
        [1, 0],
        [1, 1],
        [1, 2],
      ],
      [
        [2, 0],
        [2, 1],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 0],
        [2, 0],
      ], // columns
      [
        [0, 1],
        [1, 1],
        [2, 1],
      ],
      [
        [0, 2],
        [1, 2],
        [2, 2],
      ],
      [
        [0, 0],
        [1, 1],
        [2, 2],
      ], //diagnoals
      [
        [0, 2],
        [1, 1],
        [2, 0],
      ],
    ];

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        board[a[0]][a[1]] &&
        board[a[0]][a[1]] === board[b[0]][b[1]] &&
        board[a[0]][a[1]] === board[c[0]][c[1]]
      ) {
        return board[a[0]][a[1]];
      }
    }

    return null;
  };

  const handleWinner = (winner: string) => {
    setScore((prevScores) => ({
      ...prevScores,
      [winner]: prevScores[winner as keyof typeof score] + 1,
    }));
    setDisabled(true);
  };

  const handleDraw = () => {
    setScore((prevScores) => ({
      ...prevScores,
      Draw: prevScores.Draw + 1,
    }));
    setGameOver(true);
  };

  const handlePlayAgain = () => {
    setGameBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
    setGameOver(false);
    setCurrentPlayer(initialPlayer);
    setDisabled(false);
  };

  return (
    <div>
      <div className={style.gameContainer}>
        <div className={style.header}>
          <div className={style.logo}>
            <XnO />
          </div>

          <div className={style.playerTurn}>
            {currentPlayer === "X" ? <IconX /> : <IconO />}
            <h6>TURN</h6>
          </div>
          <button onClick={handleRestart} className={style.restart}>
            <IconRestart />
          </button>
        </div>

        {/* Game Board */}
        <div className={style.gameBoard}>
          {gameBoard.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}_${colIndex}`}
                onClick={() => handleMove(rowIndex, colIndex)}
                disabled={disabled || !!cell}
                className={style.gameButton}
              >
                {cell === "X" ? <IconX /> : cell === "O" ? <IconO /> : ""}
              </button>
            )),
          )}
        </div>

        {/* Score Table */}
        <div className={style.tableScore}>
          <div className={`${style.score} ${style.scoreBox1}`}>
            <h6>X-WIN</h6>
            <h5>{score.X}</h5>
          </div>
          <div className={`${style.score} ${style.scoreBox2}`}>
            <h6>Draw</h6>
            <h5>{score.Draw}</h5>
          </div>
          <div className={`${style.score} ${style.scoreBox3}`}>
            <h6>O-WIN</h6>
            <h5>{score.O}</h5>
          </div>
        </div>
      </div>

      <Modal show={gameOver} onHide={() => {}}>
        <Modal.Header>
          <Modal.Title>
            {currentWinner === "Draw"
              ? "It's a Draw!"
              : `Player ${currentWinner} Wins!`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button onClick={handlePlayAgain} className={style.restart}>
            Play Again
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};
