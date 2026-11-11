import React from "react";

function Start({ numQuestions ,dispatch}) {
  return (
    <div>
      <h2>Welcome to the Quiz</h2>
      <h3>{numQuestions} questions to test your react mastery</h3>
        <button className="btn btn-ui" onClick={ ()=>dispatch({type: 'start'})    }>let's start</button>
    </div>
  );
}

export default Start;
