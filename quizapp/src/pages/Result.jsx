import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * result page
 *
 * @author Ines Rita
 */

function Result({ score, numberOfQuestions }) {
  const navigate = useNavigate();

  function clearQuizData() {
    localStorage.removeItem('quizData');
    console.log("Quiz data cleared from local storage.");
}

  async function goToStart(event) {
    event.preventDefault();
    try {
      await clearQuizData();
      navigate("/start");
    } catch (error) {
      console.error(error);
      alert("An error occurred during navigating to start page");
    }
  }

  return (
    <section className="w-full h-screen bg-gradient-to-bl from-teal-400 to-blue-500 flex flex-col justify-center items-center text-white">
      <div className="xl:w-1/2">
        <h2 className="text-5xl mb-4 font-extralight leading-none sm:text-[50px]">
          Quiz completed
        </h2>
        <h3 className="text-5xl mb-4 font-medium leading-snug sm:text-[40px]">
          You scored...
        </h3>
      </div>
      <div className="l:w-1/2 xl:space-y-8">
        <section className=" border-blue-700 mb-3 mt-10 flex flex-col items-center rounded-xl bg-blue p-8 drop-shadow-sm dark:bg-navy sm:p-12 xl:mb-0 xl:mt-0 xl:w-[564px]">
          <div className="flex flex-col items-center border-blue-700">
            <h4 className=" text-blue-700 text-[88px] font-medium sm:text-[144px]">
              {score}
            </h4>
            <h5 className="text-blue-700 text-lg font-light dark:text-lightBluish sm:text-2xl">
              out of {numberOfQuestions}
            </h5>
          </div>
        </section>
        <button
          className="bg-blue-700 hover:bg-blue-500 text-white h-14 w-full rounded-xl py-2 text-xs font-semibold transition-all duration-200 ease-in-out sm:h-[92px] sm:rounded-3xl sm:text-[28px]"
          onClick={goToStart}
        >
          Play Again
        </button>
      </div>
    </section>
  );
}

export default Result;
