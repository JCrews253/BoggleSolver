import React, { useEffect, useState } from "react";
import "./App.css";
import BoggleBoard from "./BoggleBoard";
import Button from "./Button";
import useBoggleSolver from "./hooks/useBoggleSolver";
import WordsListDisplay from "./WordsListDisplay";

const BOARD_DIMENSION = 4;

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

/**
 * @return Array of arrays representing values on a square board. BOARD_DIMENSION dictates the size.
 */
const createBoard = (letterAssignmentFunc) => {
  let boardValues = [];
  for (let i = 0; i < BOARD_DIMENSION; i++) {
    boardValues[i] = [];
    for (let j = 0; j < BOARD_DIMENSION; j++) {
      boardValues[i][j] = letterAssignmentFunc();
    }
  }
  return boardValues;
};

// Helper function for generating random letters.
const randomLetter = () =>
  ALPHABET[Math.floor(Math.random() * ALPHABET.length)];

function App() {
  // Custom hook for solving boggle boards.
  const { solveBoard } = useBoggleSolver();
  const [boardState, setBoardState] = useState(() => createBoard(randomLetter));
  const [editing, setEditing] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [foundWords, setFoundWords] = useState([]);

  // OnClick event of the generate button for setting a new random board.
  const handleGenerate = () => {
    setEditing(false);
    setFoundWords([]);
    setBoardState(createBoard(randomLetter));
  };

  // OnClick event of custom game button. Clears current board and waits for user input.
  const handleEdit = () => {
    // Fill the board with empty strings.
    setBoardState(createBoard(() => ""));
    setFoundWords([]);
    setEditing(true);
    setUserInput("");
  };

  // Takes key strokes when in a custom game creating state.
  const handleKeyDown = (event) => {
    if (editing) {
      // Convert to lower case so charCodes align when solving.
      if (ALPHABET.includes(event.key.toLowerCase())) {
        // Append the pressed key to the current input stored.
        let newInput = userInput + event.key;

        // Slice off any letters after the maximum allowed string size.
        setUserInput(newInput.slice(0, BOARD_DIMENSION ** 2));
      } else if (event.key === "Backspace") {
        // Remove the last letter from the input array.
        setUserInput(userInput.slice(0, -1));
      }
    }
  };

  // OnClick for confirmation button.
  const handleCustomBoardConfirmation = () => {
    // If the input string is not long enough when clicking the button, fill the board with random letters.
    if (userInput.length < BOARD_DIMENSION ** 2) {
      setBoardState(createBoard(randomLetter));
    }
    setEditing(false);
  };

  // OnClick event for the solve button.
  const handleSolve = () => {
    setFoundWords(solveBoard(boardState));
  };

  // UseEffect for updating the board when a user is inputting a custom game.
  useEffect(() => {
    if (editing) {
      // Put the userInput into an array of letters.
      const letters = userInput.split("");

      // While the array is less the the size needed, fill it will empty strings.
      while (letters.length < BOARD_DIMENSION ** 2) {
        letters.push("");
      }

      // Create a blank board to push letters into.
      let board = [];
      for (let i = 0; i < BOARD_DIMENSION; i++) {
        // Slice the user input into rows of length BOARD_DIMENSION.
        board[i] = letters.slice(
          BOARD_DIMENSION * i,
          BOARD_DIMENSION * i + BOARD_DIMENSION
        );
      }
      setBoardState(board);
    }
  }, [userInput, editing]);

  return (
    <div className="app" onKeyDown={handleKeyDown} tabIndex={0}>
      <h1>Boggle</h1>
      <BoggleBoard board={boardState} editing={editing} />
      <div className="actions-container">
        <Button onClick={handleGenerate} disabled={editing}>
          Generate
        </Button>
        {editing ? (
          <Button onClick={handleCustomBoardConfirmation}>
            {userInput.length >= BOARD_DIMENSION ** 2 ? "Accept" : "Cancel"}
          </Button>
        ) : (
          <Button onClick={handleEdit}>Custom Game</Button>
        )}
        <Button onClick={handleSolve} disabled={editing}>
          Solve
        </Button>
      </div>
      {editing && <p className="message">Start Typing!</p>}
      <WordsListDisplay words={foundWords} />
      <div />
    </div>
  );
}

export default App;
