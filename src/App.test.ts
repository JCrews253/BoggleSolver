import useBoggleSolver from "./hooks/useBoggleSolver";
import { renderHook, act } from "@testing-library/react-hooks";

test("solves by column", () => {
  const board = [
    ["c", "q", "q"],
    ["a", "q", "q"],
    ["t", "q", "q"],
  ];

  const { result } = renderHook(() => useBoggleSolver());
  let foundWords: string[] = [];
  act(() => {
    foundWords = result.current.solveBoard(board);
  });

  const expectedWords = ["cat", "qat"];
  expect(foundWords).toStrictEqual(expectedWords);
});

test("solves by row", () => {
  const board = [
    ["c", "a", "t"],
    ["q", "q", "q"],
    ["q", "q", "q"],
  ];

  const { result } = renderHook(() => useBoggleSolver());
  let foundWords: string[] = [];
  act(() => {
    foundWords = result.current.solveBoard(board);
  });

  const expectedWords = ["cat", "qat"];
  expect(foundWords).toStrictEqual(expectedWords);
});

test("solves by diagonal", () => {
  const board = [
    ["c", "q", "q"],
    ["q", "a", "q"],
    ["q", "q", "t"],
  ];

  const { result } = renderHook(() => useBoggleSolver());
  let foundWords: string[] = [];
  act(() => {
    foundWords = result.current.solveBoard(board);
  });

  const expectedWords = ["cat", "qat"];
  expect(foundWords).toStrictEqual(expectedWords);
});
