import Header from "./Header";
import MainBoady from "./MainBoady";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Question from "./Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";

export default function App() {
  const initialState = {
    questions: [],
    // Loading,Error,Ready,active,finished
    status: "Loading",
    index: 0,
    answers: null,
    points: 0,
  };

  const [{ questions, status, index, answers ,points}, dispatch] = useReducer(
    reducer,
    initialState,
  );
  const  numQuestions = questions.length;
  const maxPossiblePoints=questions.reduce((prev,cur)=>prev+cur.points,0)

  function reducer(state, action) {
    switch (action.type) {
      case "dataReceived":
        return { ...state, questions: action.payload, status: "ready" };

      case "dataFailed":
        return {
          ...state,
          status: "Error",
        };

      case "start":
        return {
          ...state,
          status: "active",
        };
      case "newAnswer":
        // Figure out the current question
        const question = state.questions.at(state.index);

        // Check if the answer is correct
        return {
          ...state,
          answers: action.payload,
          points:
            action.payload === question.correctOption
              ? state.points + question.points
              : state.points,
        };

      case "nextQuestion":
        return {
          ...state,
          index: state.index + 1,
          answers: null,
        };
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
        {status === "ready" && (
          <Start numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "Error" && <Error />}
        {status === "active" && (
          <>
            <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answers={answers} />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answers={answers}
            />

            <NextButton dispatch={dispatch} answers={answers} />
          </>
        )}
      </MainBoady>
    </div>
  );
}
