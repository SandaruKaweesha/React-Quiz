import React from 'react'
import Options from './components/Options'
function Question({question, dispatch, answers}) {
  return (
    <div>
        <h4>{question.question}</h4>
        <Options question={question} dispatch={dispatch} answers={answers} />
  </div>
  )
}

export default Question

