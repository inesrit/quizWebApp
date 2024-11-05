import React, { useState, useEffect } from "react";
import axios from "axios";
import Result from "./Result";

function Quiz() {
    const [quizData, setQuizData] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [progressBar, setProgressBar] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [score, setScore] = useState(0);
    const [showNextQuestion, setShowNextQuestion] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchQuizData() {
            const storedQuizData = localStorage.getItem('quizData');

            if (storedQuizData) {
                setQuizData(JSON.parse(storedQuizData));
                console.log( JSON.parse(storedQuizData));
                return;
            }

            try {
                const response = await axios.get("https://opentdb.com/api.php?amount=10&type=multiple");
                if (response.status === 200) {
                    const formattedData = response.data.results.map((item) => {
                        const allOptions = [...item.incorrect_answers, item.correct_answer];
                        return {
                            ...item,
                            question: decodeHtml(item.question),
                            options: shuffleArray(allOptions.map(decodeHtml)), 
                        };
                    });
                    setQuizData(formattedData);
                    console.log( JSON.stringify(formattedData));
                    localStorage.setItem('quizData', JSON.stringify(formattedData));
                } else {
                    throw new Error("Failed to fetch quiz data");
                }
            } catch (error) {
                if (error.response && error.response.status === 429) {
                    setTimeout(fetchQuizData, 60000);
                } else {
                    console.error(error);
                    alert("An error occurred during fetching quiz data");
                }
            }
        }
        fetchQuizData();
    }, []);

    function decodeHtml(html) {
        const txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    // Utility function to shuffle options
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    let currentQuestion = quizData[questionIndex];
    let numberOfQuestions = quizData.length;

    function handleSelectedAnswer(option) {
        setSelectedAnswer(option);
        setError(false);
    }

    function handleSubmit() {
        if (!selectedAnswer) {
            setError(true);
            return;
        }

        setIsSubmitted(true);
        if (selectedAnswer === currentQuestion.correct_answer) {
            setScore(score + 1);
        }
        setShowNextQuestion(true);
    }

    function handleNextQuestion() {
        setIsSubmitted(false);
        setSelectedAnswer("");
        setShowNextQuestion(false);
        setQuestionIndex(questionIndex + 1);
        setProgressBar(((questionIndex + 1) / numberOfQuestions) * 100);
    }

    return (
        <>
            {questionIndex >= numberOfQuestions ? (
                <Result score={score} numberOfQuestions={numberOfQuestions} />
            ) : (
                <section className="w-full h-screen bg-gradient-to-bl from-teal-400 to-blue-500 flex flex-col justify-center items-center">
                    <div className="mb-10 xl:mb-0 xl:flex xl:h-[452px] xl:w-1/2 xl:flex-col xl:justify-between">
                        <div className="text-white xl:w-[465px]">
                            <p className="text-sm italic text-greyNavy dark:text-lightBluish sm:text-[20px]">
                                Question {questionIndex + 1} of {numberOfQuestions}
                            </p>
                            <h2 className="text-[20px] font-medium sm:text-[36px]">
                                {currentQuestion?.question}
                            </h2>
                        </div>
                        <div className="mt-6 flex h-4 w-full items-center justify-start rounded-full bg-white px-1 dark:bg-navy xl:w-[465px]">
                            <span
                                className="h-2 rounded-[104px] bg-blue-700"
                                style={{ width: `${progressBar}%` }}
                            ></span>
                        </div>
                    </div>
                    <div className="xl:w-1/2">
                        <ul className="space-y-3 pb-3 sm:space-y-6 sm:pb-6">
                            {currentQuestion?.options.map((option, index) => {
                                const letter = String.fromCharCode(65 + index);
                                const isSelected = selectedAnswer === option;
                                const isCorrect = currentQuestion.correct_answer === option;
                                const bgColor = isSelected
                                    ? isCorrect
                                        ? "text-white bg-green"
                                        : "bg-red text-white"
                                    : "bg-blue text-white";
                                const borderColor =
                                    isSelected && isSubmitted
                                        ? isCorrect
                                            ? "border-green-700 dark:border-green"
                                            : "border-red-700 dark:border-red"
                                        : "border-white dark:border-navy";
                                return (
                                    <li
                                        key={index}
                                        className={
                                            isSubmitted
                                                ? `text-white min-h-14 sm:min-h-20 pointer-events-none flex h-auto w-full items-center justify-between gap-4 rounded-xl border-[3px] bg-blue p-3 font-medium drop-shadow-sm dark:border-navy dark:bg-navy dark:text-white sm:rounded-3xl xl:min-h-[92px] xl:w-[564px] ${borderColor}`
                                                : `text-white min-h-14 sm:min-h-20 group flex h-auto w-full cursor-pointer items-center gap-4 rounded-xl border-[3px] bg-blue p-3 font-medium drop-shadow-sm dark:border-navy dark:bg-navy dark:text-white sm:rounded-3xl xl:min-h-[92px] xl:w-[564px] ${
                                                      isSelected
                                                          ? "border-blue-700 dark:border-purple"
                                                          : "border-white dark:border-navy"
                                                  }`
                                        }
                                        onClick={() => handleSelectedAnswer(option)}
                                    >
                                        <span
                                            className={
                                                isSubmitted
                                                    ? `flex h-10 w-10 items-center justify-center rounded-md text-[18px] uppercase text-greyNavy sm:h-14 sm:w-14 sm:rounded-xl sm:text-[28px] ${bgColor}`
                                                    : `flex h-10 w-10 items-center justify-center rounded-md text-[18px] uppercase text-greyNavy sm:h-14 sm:w-14 sm:rounded-xl sm:text-[28px] ${bgColor} ${
                                                          isSelected
                                                              ? "bg-purple text-white group-hover:bg-purple group-hover:text-white"
                                                              : "bg-lightGrey"
                                                      }`
                                            }
                                        >
                                            {letter}
                                        </span>
                                        <p className="w-[200px] text-base sm:w-[456px] sm:text-[28px] sm:leading-tight">
                                            {option}
                                        </p>
                                        <span className="ml-auto h-8 w-8 sm:h-10 sm:w-10">
                                            {isSelected && isSubmitted ? (
                                                isCorrect ? (
                                                    <img
                                                        src="/icon-correct.svg"
                                                        alt="Correct"
                                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                                    />
                                                ) : (
                                                    <img
                                                        src="/icon-incorrect.svg"
                                                        alt="Incorrect"
                                                        className="h-8 w-8 sm:h-10 sm:w-10"
                                                    />
                                                )
                                            ) : isSubmitted && isCorrect ? (
                                                <img
                                                    src="/icon-correct.svg"
                                                    alt="Correct"
                                                    className="h-8 w-8 sm:h-10 sm:w-10"
                                                />
                                            ) : null}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                        {!showNextQuestion ? (
                            <button
                                className="bg-blue-700 hover:bg-blue-500 text-white h-14 w-full rounded-xl py-2 text-xs font-semibold transition-all duration-200 ease-in-out sm:h-[92px] sm:rounded-3xl sm:text-[28px]"
                                onClick={handleSubmit}
                            >
                                Submit Answer
                            </button>
                        ) : (
                            <button
                                className="bg-blue-700 hover:bg-blue-500 text-white h-14 w-full rounded-xl py-2 text-xs font-semibold transition-all duration-200 ease-in-out sm:h-[92px] sm:rounded-3xl sm:text-[28px]"
                                onClick={handleNextQuestion}
                            >
                                Next Question
                            </button>
                        )}
                        {error ? (
                            <p className="mt-3 flex items-center justify-center gap-2 text-[18px] text-red sm:text-2xl">
                                <img src="/icon-incorrect.svg" alt="Please select an answer" />
                                <span>Please select an answer</span>
                            </p>
                        ) : null}
                    </div>
                </section>
            )}
        </>
    );
}

export default Quiz;
