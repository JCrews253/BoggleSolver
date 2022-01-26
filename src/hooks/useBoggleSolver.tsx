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

// Function for inserting words into the trie.
const insert = (root: Node, word: string) => {
  let child = root;

  // Loop through each letter in the word.
  for (let i = 0; i < word.length; i++) {
    // Find the index of each letter by converting to charCode and offsetting by 'a'.
    let index = word[i].charCodeAt(0) - "a".charCodeAt(0);

    // If the child is null, create a new node there.
    if (child.children[index] === null) {
      child.children[index] = {
        leaf: false,
        children: Array(26).fill(null),
        letter: word[i],
      };
    }

    // Set the current node to the child.
    child = child.children[index];
  }

  // Once the word is inserted, mark as a leaf so we know it's the end of a word.
  child.leaf = true;
};

// Function for checking if a word is in the trie.
// Returns 'found' if present, 'prefix' if a partial match is found, or 'not found'.
const searchWord = (root: Node, word: string): searchResult => {
  let current = root;

  // Loop through each letter in the word.
  for (let i = 0; i < word.length; i++) {
    // Find the index of each letter by converting to charCode and offsetting by 'a'.
    let index = word[i].charCodeAt(0) - "a".charCodeAt(0);

    // If the path is not null, then the word exists or is a prefix of a word.
    if (current.children[index] !== null) {
      current = current.children[index];
    } else {
      // Return 'notFound' because the path ended.
      return "notFound";
    }
  }

  // If leaf is true, return found since that marks an entire word.
  if (current.leaf === true) {
    return "found";
  }

  // Return 'prefix' since the end of a word was not detected.
  return "prefix";
};

const useBoggleSolver = () => {
  const [trie, setTrie] = useState<Node>({
    leaf: false,
    children: Array(26).fill(null),
    letter: null,
  });

  // Read and store the dictionary in a trie on load so we dont have to rebuild every time we want to solve a board.
  useEffect(() => {
    let newTrie = {
      leaf: false,
      children: Array(26).fill(null),
      letter: null,
    };

    // Read in the dictionary.
    let dictionary = dictionaryJson as DictionaryData;

    // Insert each word that is 3 or more letters long.
    dictionary.words
      .filter((word) => word.length >= 3)
      .map((word) => insert(newTrie, word));
    setTrie(newTrie);
  }, []);

  // Function for solving board of size NxN.
  const solveBoard = (board: string[][]) => {
    // Create a blank array of arrays filled with false.
    let visited: boolean[][] = Array(board.length)
      .fill(false)
      .map(() => Array(board.length).fill(false));

    // Used for storing the current word trying to be built.
    let currentWord = "";

    // Used for storing all found words on the board.
    let foundWords: string[] = [];

    // Recursive function for searching a position on the board.
    const searchBoard = (row: number, col: number) => {
      // Check if our current word is in the stored trie.
      let result = searchWord(trie, currentWord);

      // Check if the word is a match or partial match.
      if (result !== "notFound") {
        if (result === "found") {
          // Add word to the list if found.
          foundWords.push(currentWord);
        }

        // Recursively check the surrounding spaces for word matches.
        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (
              r >= 0 &&
              r < board.length &&
              c >= 0 &&
              c < board.length &&
              visited[r][c] === false
            ) {
              // Mark the position visited.
              visited[r][c] = true;

              // Append the current letter to the current word.
              currentWord = currentWord + board[r][c];

              // Check if the current word is in the trie.
              searchBoard(r, c);

              // Remove the letter from the current word.
              currentWord = currentWord.slice(0, -1);

              // Reset the visited flag.
              visited[r][c] = false;
            }
          }
        }
      }
    };

    // Loop through each row in the board.
    for (let rowIdx = 0; rowIdx < board.length; rowIdx++) {
      // Reset the current word on each pass.
      currentWord = "";

      // Loop through each letter in the row.
      for (let colIdx = 0; colIdx < board.length; colIdx++) {
        // Mark the position visited.
        visited[rowIdx][colIdx] = true;

        // Append the current letter to the current word.
        currentWord = currentWord + board[rowIdx][colIdx];

        // Check if the current word is in the trie.
        searchBoard(rowIdx, colIdx);

        // Remove the letter from the current word.
        currentWord = currentWord.slice(0, -1);

        // Reset the visited flag.
        visited[rowIdx][colIdx] = false;
      }
    }

    // Found words can contain duplicates, so we create a set of the words and then spread them to remove duplicates.
    return [...new Set(foundWords)];
  };

  return { solveBoard };
};

export default useBoggleSolver;
