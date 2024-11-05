import { useNavigate } from "react-router-dom";

/**
 * quiz start page
 *
 * @author Ines Rita
 */

function Start() {
  const navigate = useNavigate();

  async function goToQuiz(event) {
    event.preventDefault();
    try {
      navigate("/quiz");
    } catch (error) {
      console.error(error);
      alert("An error occurred during navigating to quiz page");
    }
  }

  return (
    <div className="w-full h-screen bg-gradient-to-bl from-teal-400 to-blue-500 flex flex-col justify-center items-center text-white">
      <div className="text-center">
        <h1 className="text-5xl mb-4">
          Press <b>Start</b> to Begin Quiz!
        </h1>
        <p className="mb-6">
          Answer multiple choice and true or false questions and check your
          results at the end.
        </p>
        <button
          className="bg-blue-700 hover:bg-blue-500 text-white h-14 w-full rounded-xl py-2 text-xs font-semibold transition-all duration-200 ease-in-out sm:h-[92px] sm:rounded-3xl sm:text-[28px]"
          onClick={goToQuiz}
        >
          Start
        </button>
      </div>
    </div>
  );
}

export default Start;
