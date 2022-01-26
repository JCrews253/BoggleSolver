import React from "react";
import "./Styles/BoggleBoard.css";

interface BoggleBoardProps {
  board: string[][];
}

const BoggleBoard = ({ board }: BoggleBoardProps) => {
  return (
    <div className="board-container">
      {board.map((row, rowIdx) => {
        return (
          <div className="row-container" key={`board-row-${rowIdx}`}>
            {row.map((rowItem, colIdx) => (
              <div
                className="dice-container"
                key={`board-row-${rowIdx}-column-${colIdx}`}
              >
                {rowItem}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default BoggleBoard;
