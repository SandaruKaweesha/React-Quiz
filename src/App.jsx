import Header from "./Header";
import MainBoady from "./MainBoady";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Question from "./Question";

export default function App() {
  
  const initialState = {
    questions: [],
    // Loading,Error,Ready,active,finished
    status: "Loading",
    index: 0,
  };
  
  const [{ questions, status ,index}, dispatch] = useReducer(reducer, initialState);
  const numQuestions = questions.length;


  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };

      case "dataFailed":
        return {
          ...state,
          status: "Error",
        };

      case 'start':
        return{
          ...state,
          status: 'active'
        }
      default:
        throw new Error("Action unknown ");
    }
  }

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="App">
      <Header />

      <MainBoady>
        {status === "Loading" && <Loader />}
        {status === "ready" && <Start numQuestions={numQuestions}  dispatch={dispatch}/>}
        {status === "Error" && <Error />}
        {status === "active" && <Question question={questions[index]}  /> }
      </MainBoady>
    </div>
  );
}
