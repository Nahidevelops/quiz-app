import React, { useState, useEffect, useCallback } from "react";
import "./App.css";

const questions = [
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
  { question: "What color is the sky?", options: ["Green", "Blue", "Red", "Yellow"], answer: "Blue" },
  { question: "Which animal says 'meow'?", options: ["Dog", "Cat", "Cow", "Horse"], answer: "Cat" },
  { question: "How many days in a week?", options: ["5", "6", "7", "8"], answer: "7" },
  { question: "What do bees make?", options: ["Milk", "Honey", "Juice", "Bread"], answer: "Honey" },
  { question: "Which shape has 3 sides?", options: ["Square", "Circle", "Triangle", "Rectangle"], answer: "Triangle" }
];
export default function QuizApp() {
  const [page, setPage] = useState("intro");
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timeUp, setTimeUp] = useState(false);
  const [clickedOption, setClickedOption] = useState(null);

  const nextQuestion = useCallback(() => {
    setTimeUp(false);
    setClickedOption(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setTimeLeft(15);
    } else {
      setPage("result");
    }
  }, [current]);

  useEffect(() => {
    if (page !== "quiz") return;
    if (timeLeft === 0) setTimeUp(true);
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, page]);

  const handleAnswer = (option) => {
    setClickedOption(option);
    if (option === questions[current].answer) {
      setScore(score + 1);
      setTimeout(nextQuestion, 500);
    } else {
      setTimeout(nextQuestion, 800);
    }
  };

  return (
    <div className="quiz-container">
      {page === "intro" && (
        <div className="intro-page">
          <h1 className="quiz-title">Welcome to the Advanced Quiz!</h1>
          <button className="start-btn" onClick={() => { setPage("quiz"); setTimeLeft(15); }}>Start Quiz</button>
        </div>
      )}

      {page === "quiz" && (
        <div className="quiz-page">
          <h2 className="question">{questions[current].question}</h2>
          <p className="timer">Time Left: {timeLeft}s</p>
          {timeUp && <p style={{ color: 'red', fontWeight: 'bold' }}>Time's Up!</p>}
          <div className="options">
            {questions[current].options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${clickedOption && option !== questions[current].answer && option === clickedOption ? 'wrong shake' : ''}`}
                onClick={() => handleAnswer(option)}
                disabled={clickedOption}
              >
                {option} {clickedOption && option !== questions[current].answer && option === clickedOption ? '❌' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {page === "quiz" && (
        <button className="skip-btn" onClick={nextQuestion}>Skip</button>
      )}

      {page === "result" && (
        <div className="result-page">
          <h1 className="quiz-title">Quiz Complete!</h1>
          <p className="score">Your Score: {score}/{questions.length}</p>
          <p>Great Job! 🎉</p>
        </div>
      )}
    </div>
  );
}
