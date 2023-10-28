import React, { useState } from "react";
import "./App.css";

// A helper function to create an empty 9x9 board
const createEmptyBoard = () => {
  let board = [];
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      row.push("");
    }
    board.push(row);
  }
  return board;
};

const isValidRowForK = (board, row, k) => {
  if (row === undefined)
    return false;
  // console.log("isValidrowForK row:", row, " k:", k,
  // " board len: ", board.length);
  for (let col = 0; col < 9; col++) {
    // console.log("isValidRowForK k:", k,
    // " board[", row, "][", col, "]: ", board[row][col]);
    if (parseInt(board[row][col]) === k) {
      return false;
    }
  }
  return true;
};  

const isValidColForK = (board, col, k) => {
  if (col === undefined)
    return false;
  for (let row = 0; row < 9; row++) {
    // console.log("isValidColForK k:", k,
    // " board[", row, "][", col, "]: ", board[row][col]);
    if (parseInt(board[row][col]) === k) {
      return false;
    }
  }
  return true;
};

const isValidBlockForK = (board, row, col, k) => {
  if (row === undefined || col === undefined)
    return false;
  let stRow = parseInt(row / 3) * 3;
  let stCol = parseInt(col / 3) * 3;
  for (let x = stRow; x < (stRow + 3); x++) {
    for (let y = stCol; y < (stCol + 3); y++) {
      if (parseInt(board[x][y]) === k)
        return false;
    }
  }
  return true;
};

// A helper function to solve a board using an algorithm of your choice
const solveBoardRecur = (board, boardSolved, row, col) => {
  // console.log("solveBoardRecur Enter row:", row, " col:", col);
  if (row === undefined || col === undefined)
    return true;
  if (row >= 9)
  return true;
  if (col >= 9) {
    // console.log("solveBoardRecur Return from col row:", row, " col:", col);
    return solveBoardRecur(board, boardSolved, row+1, 0);
  }
  if (parseInt(board[row][col]) >= 1 && parseInt(board[row][col]) <= 9) {
    return solveBoardRecur(board, boardSolved, row, col+1);
  }

  for (let k = 1; k <= 9; k++) {
    let isValidBlock = isValidBlockForK(boardSolved, row, col, k);
    let isValidCol = isValidColForK(boardSolved, col, k);
    let isValidRow = isValidRowForK(boardSolved, row, k);
    if (isValidBlock && isValidCol && isValidRow) {
      // console.log("isValidBlock:", isValidBlock,
      // " isValidCol:", isValidCol,
      // " isValidRow:", isValidRow,
      //  " solveBoardRecur row:", row, " col:", col, " valid k:", k);
        boardSolved[row][col] = '123456789'.charAt(k-1);// toString(k);
        if (solveBoardRecur(board, boardSolved, row, col+1))
          return true;
        boardSolved[row][col] = '0';
      }
  }
  return false;
};

const solveBoard = async (board) => {
    // console.log(solveBoard);
    let boardSolved = [...board];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        // console.log("board[", row, "][", col, "]:", board[row][col]);
        // console.log("boardSolved[", row, "][", col, "]:", boardSolved[row][col]);
        if ((!board[row][col] || parseInt(board[row][col]) <= 0 || parseInt(board[row][col]) > 9)) {
            // console.log("start solving boardSolved[", row, "][", col, "]:", boardSolved[row][col]);
            console.log("start solving board[", row, "][", col, "]:", board[row][col]);
            let isSolved = await solveBoardRecur(board, boardSolved, row, col);
            console.log("Solved: ", boardSolved);
            if (isSolved) {
              return boardSolved;
            }
            return boardSolved;
        }
      }
    }
    return boardSolved;
};

// A component that renders a single cell of the Sudoku board
const Cell = ({ value, onChange, isSolving }) => {
  return (
    <input
      className="cell"
      type="number"
      value={value}
      onChange={(e) => onChange(e)}
      maxLength="1"
      min={0}
      max={9}
      />
      );
  };

// A component that renders a single row of the Sudoku board
const Row = ({ row, onChange, isSolving }) => {
  return (
    <div className="row">
      {row.map((value, index) => (
        <Cell
          isSolving={isSolving}
          key={index}
          value={value}
          onChange={(e) => onChange(e, index, e.target.value)}
        />
      ))}
    </div>
  );
};

// To be modified for showing 3x3 Blocks
// const Block = ({ row, onChange, isSolving }) => {
//   return (
//     <div className="block">
//       {row.map((value, index) => (
//         <Cell
//           isSolving={isSolving}
//           key={index}
//           value={value}
//           onChange={(e) => onChange(e, index, e.target.value)}
//         />
//       ))}
//     </div>
//   );
// };

// A component that renders the entire Sudoku board
const Board = ({ board, onChange, isSolving }) => {
  return (
    <div className="board-container">
      <div className="board">
        {board.map((row, index) => (
          <Row
            isSolving={isSolving}
            key={index}
            row={row}
            onChange={(e, cellIndex, value) =>
              onChange(e, index, cellIndex, value)
            }
          />
        ))}
      </div>
    </div>
  );
};

// To be modified for showing 3x3 Blocks
// const Board = ({ board, onChange, isSolving }) => {
//   return (
//     <div className="board-container">
//       <div className="board">
//         {board.map((row, index) => (
//           if (row === 0 || row === 3 || row === 9)
//           {
//             <Row
//               isSolving={isSolving}
//               key={index}
//               row={row}
//               onChange={(e, cellIndex, value) =>
//                 onChange(e, index, cellIndex, value)
//               }
//             />

//           }
//         ))}
//       </div>
//     </div>
//   );
// };

// A component that renders the main app
const App = () => {
  // A state variable that stores the current board
  const [board, setBoard] = useState(createEmptyBoard());

  const [isSolving, setIsSolving] = useState(false);

  // A state variable that stores the message to display
  const [message, setMessage] = useState("");

  // A handler function that updates the board when the user changes a cell value
  const handleCellChange = (event, rowIndex, cellIndex, value) => {
    // if (!/^[0-9]$/.test(value)) {
    //   return;
    // }

    if (event.target.className === "cell")
    {
      if (!isSolving && event)
      {
        event.target.style.fontWeight = "bold"; 
      }
    }

    console.log("isSolving:", isSolving);
    // Copy the current board
    let newBoard = [...board];

    // Update the cell value with the user input
    newBoard[rowIndex][cellIndex] = value % 10; // just show the last entered digit

    // if (!isSolving)
    // {
    //   // bold Cell text
    //   thisElement.
    // }

    // Set the new board as the state
    setBoard(newBoard);

    // Clear the message
    setMessage("");
  };

  // reset board
  const handleResetClick = () => {
    let board = createEmptyBoard();
    setMessage("The board is reset!");
    setIsSolving(false);
    setBoard(board);
  };
  
  // A handler function that validates the board when the user clicks the validate button
  const validateBoard = (board) => {
    // Check if the board is valid or not using the helper function
    
    // check if each row is valid
    for (let row = 0; row < 9; row++)
    {
      let vis = new Set();
      for (let col = 0; col < 9; col++)
      {
        if (board[row][col] >= '1' && board[row][col] <= '9')
        {
          if (vis.has(board[row][col]))
            return false;
          vis.add(board[row][col]);
        }
      }
    }

    // check if each col is valid
    for (let col = 0; col < 9; col++)
    {
      let vis = new Set();
      for (let row = 0; row < 9; row++)
      {
        if (board[row][col] >= '1' && board[row][col] <= '9')
        {
          if (vis.has(board[row][col]))
            return false;
          vis.add(board[row][col]);
        }
      }
    }

    // validate 3x3 blocks
    let blockStartRow = [0, 3, 6];
    let blockStartCol = [0, 3, 6];
    for (let startRow of blockStartRow) {
      for (let startCol of blockStartCol) {
        const blockSize = 3;
        let vis = new Set(); 
        for (let row = startRow; row < (startRow + blockSize); row++) {
          for (let col = startCol; col < (startCol + blockSize); col++) {
            if (board[row][col] && board[row][col] >= '1' && board[row][col] <= '9') {
              if (vis.has(board[row][col]))
                return false;
              vis.add(board[row][col]);
            }
          }
        }
      }
    }

    return true;
  };

  // A handler function that solves the board when the user clicks the solve button
  const handleSolveClick = () => {

    if (!validateBoard(board))
    {
      setMessage("The board is invalid!");
    }
    else
    {
      setIsSolving(true);
      // Solve the board using the helper function
      const boardSolvedPromise = solveBoard(board);
      boardSolvedPromise.then((boardSolved) => {
          if (boardSolved) {
            setMessage("The board is solved!");
            // Set the solved board as the state
            setBoard(boardSolved);
          } else {
            // console.log("bad !!!");
            setMessage("The board is unsolvable!");
          }
        }
      );
    }
    setIsSolving(false);
  };

  return (
    <div className="app-container">
      <div className="app">
        <h1 className="app-header">Sudoku Solver App</h1>
        <Board board={board} onChange={handleCellChange} isSolving={isSolving} />
        <div className="sudoku-buttons-group">
          <button className="sudoku-button" onClick={handleResetClick}>Reset</button>
          <button className="sudoku-button" onClick={handleSolveClick}>Solve</button>
        </div>
        <p className="message">{message}</p>
      </div>
    </div>
  );
};

export default App;
