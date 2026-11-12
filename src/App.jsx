import Header from "./Header";
import MainBoady from "./MainBoady";
import { useEffect, useReducer } from "react";
import Loader from "./Loader";
import Error from "./Error";
import Start from "./Start";
import Question from "./Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishEd from "./components/FinishEd";
import Timer from "./components/Timer";
import Footer from "./components/Footer";

const initialState = {
  questions: [],
  // Loading,Error,Ready,active,finished
  status: "Loading",
  index: 0,
  answers: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};

const SECONDS_PER_QUESTION = 30;

export default function App() {
  const [
    { questions, status, index, answers, points, highScore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0,
  );

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
          secondsRemaining: state.questions.length*SECONDS_PER_QUESTION,
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

      case "finish":
        return {
          ...state,
          status: "finished",
          highScore:
            state.points > state.highScore ? state.points : state.highScore,
        };

      case "reset":
        return {
          initialState,
          questions: state.questions,
          status: "ready",
        };

      case "tick":
        return {
          ...state,
          secondsRemaining: state.secondsRemaining - 1,
          status: state.secondsRemaining === 0 ? "finished" : state.status,
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
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
              answers={answers}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answers={answers}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answers={answers}
                index={index}
                numOfQuesations={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishEd
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </MainBoady>
    </div>
  );
}
