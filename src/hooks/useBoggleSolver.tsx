import { useEffect, useState } from "react";
import * as dictionaryJson from "../dictionary_en_US.json";

interface Node {
  leaf: boolean;
  children: Node[];
  letter: string | null;
}

interface DictionaryData {
  words: string[];
}

type searchResult = "notFound" | "found" | "prefix";

const insert = (root: Node, word: string) => {
  let child = root;
  for (let i = 0; i < word.length; i++) {
    let index = word[i].charCodeAt(0) - "a".charCodeAt(0);

    if (child.children[index] === null) {
      child.children[index] = {
        leaf: false,
        children: Array(26).fill(null),
        letter: word[i],
      };
    }
    child = child.children[index];
  }

  child.leaf = true;
};

const searchWord = (root: Node, word: string): searchResult => {
  let current = root;
  for (let i = 0; i < word.length; i++) {
    let index = word[i].charCodeAt(0) - "a".charCodeAt(0);
    if (current.children[index] !== null) {
      current = current.children[index];
    } else {
      // Return 0 if the word does not exist or is not a prefix of a word.
      return "notFound";
    }
  }

  // Return 2 if the current word exists.
  if (current.leaf === true) {
    return "found";
  }

  // Return 1 for string being a prefix of a word.
  return "prefix";
};

const useBoggleSolver = () => {
  const [trie, setTrie] = useState<Node>({
    leaf: false,
    children: Array(26).fill(null),
    letter: null,
  });

  useEffect(() => {
    let newTrie = {
      leaf: false,
      children: Array(26).fill(null),
      letter: null,
    };
    let dictionary = dictionaryJson as DictionaryData;
    dictionary.words
      .filter((word) => word.length >= 3)
      .map((word) => insert(newTrie, word));
    setTrie(newTrie);
  }, []);

  const solveBoard = (board: string[][]) => {
    let visited: boolean[][] = Array(board.length)
      .fill(false)
      .map(() => Array(board.length).fill(false));
    let currentWord = "";
    let foundWords: string[] = [];

    const searchBoard = (row: number, col: number) => {
      let result = searchWord(trie, currentWord);
      if (result !== "notFound") {
        if (result === "found") {
          foundWords.push(currentWord);
        }

        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (
              r >= 0 &&
              r < board.length &&
              c >= 0 &&
              c < board.length &&
              visited[r][c] === false
            ) {
              visited[r][c] = true;
              currentWord = currentWord + board[r][c];
              searchBoard(r, c);
              currentWord = currentWord.slice(0, -1);
              visited[r][c] = false;
            }
          }
        }
      }
    };

    for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {
      currentWord = "";
      for (let colIdx = 0; colIdx < board.length; colIdx++) {
        visited[rowIdx][colIdx] = true;
        currentWord = currentWord + board[rowIdx][colIdx];
        searchBoard(rowIdx, colIdx);
        currentWord = currentWord.slice(0, -1);
        visited[rowIdx][colIdx] = false;
      }
    }
    return [...new Set(foundWords)];
  };

  return { solveBoard };
};

export default useBoggleSolver;
