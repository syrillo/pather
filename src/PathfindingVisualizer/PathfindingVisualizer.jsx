import React, {useState, useEffect} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrder2} from '../algorithms/astar';


import './PathfindingVisualizer.css';

const DEFAULT_START_NODE_ROW = 1;
const DEFAULT_START_NODE_COL = 2;
const DEFAULT_FINISH_NODE_ROW = 15;
const DEFAULT_FINISH_NODE_COL = 25;

function PathfindingVisualizer() {
  const [thegrid, setTheGrid] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [startCol, setStartCol] = useState(DEFAULT_START_NODE_COL);
  const [startRow, setStartRow] = useState(DEFAULT_START_NODE_ROW);
  const [finishCol, setFinishCol] = useState(DEFAULT_FINISH_NODE_COL);
  const [finishRow, setFinishRow] = useState(DEFAULT_FINISH_NODE_ROW);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isStartNode, setIsStartNode] = useState(false);
  const [isFinishNode, setIsFinishNode] = useState(false);
  const [isWallNode, setIsWallNode] = useState(false);
  const [oldRow, setOldRow] = useState(0);
  const [oldCol, setOldCol] = useState(0);


  useEffect(() => {
    const initialgrid = getInitialGrid();
    setTheGrid(...thegrid, initialgrid);
  },[])

  function handleMouseDown(row, col) {

    if (!disabled) {
      let nodeClassName = document.getElementById(`node-${row}-${col}`).className;

      if (nodeClassName === 'node node-start') {
        setMouseIsPressed(true);
        setIsStartNode(isStartNode => !isStartNode);
        setOldRow(row);
        setOldCol(col);
        
      } else if (nodeClassName === 'node node-finish') {
        setMouseIsPressed(true);
        setIsFinishNode(isFinishNode => !isFinishNode);
        setOldRow(row);
        setOldCol(col);
        console.log('Mouse Down');
        
        
      } else {
        const newGrid = getNewGridWithWallToggled(thegrid, row, col);
        setTheGrid(newGrid);
        setMouseIsPressed(true);
        setIsWallNode(isWallNode => !isWallNode);
        setOldRow(row);
        setOldCol(col);
      }

      console.log(mouseIsPressed);
    }
  }

  function handleMouseEnter(row, col) {

    if(!disabled) {

      if(mouseIsPressed) {

        if(isStartNode) {

          const prevStartNode = thegrid[oldRow][oldCol];
          prevStartNode.isStart = false;
          document.getElementById(`node-${oldRow}-${oldCol}`).className = 'node';

          setOldRow(row);
          setOldCol(col);
          const newStartNode = thegrid[row][col];
          newStartNode.isStart = true;
          document.getElementById(`node-${row}-${col}`).className = 'node node-start';

          setStartRow(row);
          setStartCol(col);

        } else if (isFinishNode) {

          const prevFinishNode = thegrid[oldRow][oldCol];
          prevFinishNode.isFinish = false;
          document.getElementById(`node-${oldRow}-${oldCol}`).className = 'node';

          setOldRow(row);
          setOldCol(col);
          const newFinishNode = thegrid[row][col];
          newFinishNode.isFinish = true;
          document.getElementById(`node-${row}-${col}`).className = 'node node-finish';

          setFinishRow(row);
          setFinishCol(col);
          console.log('Mouse Enter');
          console.log(mouseIsPressed);

        } else if (isWallNode) {

          const newGrid = getNewGridWithWallToggled(thegrid, row, col);
          setTheGrid(newGrid);

        }

      }
    }

  }

  function handleMouseUp(row, col) {
    if (1 === 1) {
      
      setMouseIsPressed(false);

      if(isStartNode) {
        const startNodeIs = !isStartNode;
        setIsStartNode(startNodeIs);
        setStartRow(row);
        setStartCol(col);

      } else if (isFinishNode) {
        const finishNodeIs = !isFinishNode;
        setIsFinishNode(finishNodeIs);
        setFinishRow(row);
        setFinishCol(col);
        console.log('Mouse Up');
        console.log(mouseIsPressed);
        
      } else if (isWallNode) {
        const wallNodeIs = !isWallNode;
        setIsWallNode(wallNodeIs);
      }
    }
  }

  function animatePather(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {

      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }

      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    };
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {

      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];

        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
        if (i + 1 === nodesInShortestPathOrder.length) {
          setDisabled(false);
        }
      }, 50 * i);
    }
  }

  function visualizeDijkstra() {
    setDisabled(true);
    const grid1 = thegrid;
    const startNode = grid1[startRow][startCol];
    const finishNode = grid1[finishRow][finishCol];
    const visitedNodesInOrder = dijkstra(grid1, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animatePather(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualizeAStar() {
    setDisabled(true);
    const grid2 = thegrid;
    const startNode = grid2[startRow][startCol];
    const finishNode = grid2[finishRow][finishCol];
    const visitedNodesInOrder2 = astar(grid2, startNode, finishNode);
    const nodesInShortestPathOrder2 = getNodesInShortestPathOrder2(finishNode);
    animatePather(visitedNodesInOrder2, nodesInShortestPathOrder2);
  }

  const grid = thegrid;
  return (
    <>
      <h4 className="header">
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => visualizeAStar()}>Visualize A*</button>
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => visualizeDijkstra()}>Visualize Dijkstra</button>
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => clearBoard()}>Clear Board</button>
      </h4>
      <div className="grid background-color">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall, mouseIsPressed} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    row={row}
                    isWall={isWall}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                    onMouseUp={(row, col) => handleMouseUp(row, col)}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="background"></div>
    </>
  );

  function clearWalls() {
    //come back to this
  }

  function clearBoard() {
    const newBoardGrid = thegrid;
    for (const row of newBoardGrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        
        if (nodeClassName !== 'node node-start' || nodeClassName !== 'node node-finish') {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
          node.manhattenD = 0;
          node.isVisited = false;
          node.distance = Infinity;
          node.previousNode = null;
          node.isWall = false;
        }

        if (node.row === startRow && node.col === startCol) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-start';
          node.manhattenD = 0;
          node.isVisited = false;
          node.distance = Infinity;
          node.previousNode = null;
        }

        if (node.row === finishRow && node.col === finishCol) {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node node-finish';
          node.manhattenD = 0;
          node.isVisited = false;
          node.distance = Infinity;
          node.previousNode = null;
        }
          
      }
    }
  }

  function getInitialGrid() {
    const grid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 40; col++) {
        currentRow.push(createNode(col, row));
      }
      grid.push(currentRow);
    }
    return grid;
  }

  function createNode(col, row) {
    return {
      col,
      row,
      isStart: row === startRow && col === startCol,
      isFinish: row === finishRow && col === finishCol,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      manhattenD: 0,
    };
  }

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    
    return newGrid;
  };
}

export default PathfindingVisualizer;
