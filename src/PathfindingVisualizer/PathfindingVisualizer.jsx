import React, {useState, useEffect} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrder2} from '../algorithms/astar';


import './PathfindingVisualizer.css';

const START_NODE_ROW = 1;
const START_NODE_COL = 2;
const FINISH_NODE_ROW = 15;
const FINISH_NODE_COL = 25;

function PathfindingVisualizer() {
  const [thegrid, setTheGrid] = useState([]);
  const [mouseIsPressed, setMousePressed] = useState(false);
  const [disabled, setDisabled] = useState(false);


  useEffect(() => {
    const initialgrid = getInitialGrid();
    setTheGrid(...thegrid, initialgrid);
  },[])

  function handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(thegrid, row, col);
    setTheGrid({...thegrid, newGrid});
    setMousePressed(!mouseIsPressed);
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
    const startNode = grid1[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid1[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid1, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animatePather(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualizeAStar() {
    setDisabled(true);
    const grid2 = thegrid;
    const startNode = grid2[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid2[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder2 = astar(grid2, startNode, finishNode);
    const nodesInShortestPathOrder2 = getNodesInShortestPathOrder2(finishNode);
    animatePather(visitedNodesInOrder2, nodesInShortestPathOrder2);
  }

  const grid = thegrid;
  const mousePressed = mouseIsPressed;
  return (
    <>
      <h4 className="header">
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => visualizeAStar()}>Visualize A*</button>
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => visualizeDijkstra()}>Visualize Dijkstra</button>
        <button disabled={disabled} className={`button ${disabled ? 'disabled-button' : ''}`} onClick={() => clearBoard()}>Clear Board</button>
        <button className="button" onClick={() => classesBoard()}>Classes of Board</button>
      </h4>
      <div className="grid background-color">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart, isWall} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    row={row}
                    isWall={isWall}
                    mouseIsPressed={mousePressed}></Node>
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

  function classesBoard() {
    for (const row of thegrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
      }
    }
  }

  function clearBoard() {
    const newBoardGrid = thegrid;
    for (const row of thegrid) {
      for (const node of row) {
        let nodeClassName = document.getElementById(`node-${node.row}-${node.col}`).className;
        
        document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
        node.manhattenD = 0;
        node.isVisited = false;
        node.distance = Infinity;
        node.previousNode = null;


        if (nodeClassName !== 'node node-start') {
          document.getElementById(`node-${node.row}-${node.col}`).className = 'node';
          
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
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
      distance: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
      manhattenD: 0,
    };
  }

  function getNewGridWithWallToggled(grid, row, col) {
    const newGrid = thegrid.slice();
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
