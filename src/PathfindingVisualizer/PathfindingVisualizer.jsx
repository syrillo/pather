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


  useEffect(() => {
    const initialgrid = getInitialGrid();
    setTheGrid(...thegrid, initialgrid);
  },[])

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
    }
  }

  function animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  function visualizeDijkstra() {
    const grid1 = thegrid;
    const startNode = grid1[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid1[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid1, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animatePather(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  function visualizeAStar() {
    const grid1 = thegrid;
    const startNode = grid1[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid1[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder2 = astar(grid1, startNode, finishNode);
    const nodesInShortestPathOrder2 = getNodesInShortestPathOrder2(finishNode);
    animatePather(visitedNodesInOrder2, nodesInShortestPathOrder2);
  }

  const grid = thegrid;
  return (
    <>
      <h4 className='header'>
        <button onClick={() => visualizeAStar()}>Visualize</button>
      </h4>
      <div className="grid">
        {grid.map((row, rowIdx) => {
          return (
            <div key={rowIdx}>
              {row.map((node, nodeIdx) => {
                const {row, col, isFinish, isStart} = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    row={row}></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );



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

  /*const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    return newGrid;
  };*/
}

export default PathfindingVisualizer;
