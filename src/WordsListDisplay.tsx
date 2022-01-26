import "./Styles/WordsListDisplay.css";

interface WordsListDisplayProps {
  words: string[];
}

const WordsListDisplay = ({ words }: WordsListDisplayProps) => {
  return (
    <div className="words-list-container">
      {words.map((word, idx) => (
        <div className="word-container" key={word}>{`${idx + 1}) ${word}`}</div>
      ))}
    </div>
  );
};

export default WordsListDisplay;
