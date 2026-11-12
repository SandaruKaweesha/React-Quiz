import React from "react";

function Options({ question, dispatch, answers }) {
  const hasAnswered = answers !== null;

  return (
    <div className="option">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option  ${index === answers ? "answer" : ""} ${hasAnswered ? index === question.correctOption ? "correct" : "wrong" : ""}`}
          key={option}
          disabled={hasAnswered}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
