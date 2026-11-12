import React from "react";

function NextButton({ dispatch, answers, index, numOfQuesations }) {
  if (answers === null) return null;

  if (index < numOfQuesations - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        Next
      </button>
    );

    if (index === numOfQuesations - 1)
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "finish" })}
      >
        Finish
      </button>
    );
}

export default NextButton;
