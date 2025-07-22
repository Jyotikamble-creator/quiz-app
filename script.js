// // script og the page begins here
// // This script handles the quiz functionality, including fetching questions, displaying them, and handling user interactions
// // grabing the elements from the DOM
// document.addEventListener("DOMContentLoaded", () => {
//     const startBtn = document.getElementById("start-btn");
//     const nextBtn = document.getElementById("next-btn");
//     const previousBtn = document.getElementById("previous-btn");
//     const restartBtn = document.getElementById("restart-btn");
//     const questionContainer = document.getElementById("quiz-container");
//     const questionText = document.getElementById("question-text");
//     const choiceList = document.getElementById("choice-list");
//     const resultContainer = document.getElementById("result-container");
//     const scoreDisplay = document.getElementById("score");


//     let questions = [];
//     let currentQuestionIndex = 0;
//     let score = 0;

//     startBtn.addEventListener("click", startQuiz);
//     nextBtn.addEventListener("click", () => navigateQuestion(1));
//     previousBtn.addEventListener("click", () => navigateQuestion(-1))
//     restartBtn.addEventListener("click", restartQuiz);

//     // Fetch questions from the API
//     // function to fetch questions from the  API
//     async function fetchQuestions() {
//         try {
//             const response = await fetch("https://opentdb.com/api.php?amount=15&category=18&type=multiple");
//             const data = await response.json();
//             questions = data.results.map(q => ({
//                 question: q.question,
//                 choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
//                 answer: q.correct_answer
//             }));
//         } catch (error) {
//             console.error("Error fetching questions:", error);
//         }
//     }

//     // function to start the quiz
//     async function startQuiz() {
//         await fetchQuestions();
//         startBtn.classList.add("hidden");
//         questionContainer.classList.remove("hidden");
//         nextBtn.classList.remove("hidden");
//         previousBtn.classList.remove("hidden");
//         showQuestion();
//     }

//     // function to show the current question and choices
//     function showQuestion() {
//         if (currentQuestionIndex >= questions.length) {
//             showResult();
//             return;
//         }

//         const currentQuestion = questions[currentQuestionIndex];
//         questionText.innerHTML = currentQuestion.question;
//         choiceList.innerHTML = "";

//         currentQuestion.choices.forEach(choice => {
//             const li = document.createElement("li");
//             li.textContent = choice;
//             li.classList.add("cursor-pointer", "p-2", "m-2", "bg-white", "rounded", "hover:bg-gray-200");
//             li.addEventListener("click", () => selectAnswer(choice));
//             choiceList.appendChild(li);
//         });
//     }

//     // function to select an answer and check if it's correct
//     function selectAnswer(choice) {
//         const correctAnswer = questions[currentQuestionIndex].answer;
//         if (choice === correctAnswer) {
//             score++;
//         }
//         nextBtn.disabled = false;
//     }
//     // function to navigate to the next questions
//     function navigateQuestion(direction) {
//         currentQuestionIndex += direction;
//         if (currentQuestionIndex < questions.length) {
//             showQuestion();
//         } else {
//             showResult();
//         }
//     }

//     // function to show the previous question
//     function showPreviousQuestion(direction) {
//         currentQuestionIndex += direction;
//         if (currentQuestionIndex >= 0) {
//             showQuestion();

//         } else {
//             currentQuestionIndex = 0;
//         }
//     }
//     // function to show the result 
//     function showResult() {
//         questionContainer.classList.add("hidden");
//         resultContainer.classList.remove("hidden");
//         scoreDisplay.textContent = `${score} out of ${questions.length}`;
//         restartBtn.classList.remove("hidden");
//     }

//     // function to restart the quiz
//     function restartQuiz() {
//         currentQuestionIndex = 0;
//         score = 0;
//         resultContainer.classList.add("hidden");
//         startQuiz();
//     }
// });
// // script of the page ends here
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const previousBtn = document.getElementById("previous-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionText = document.getElementById("question-text");
  const choiceList = document.getElementById("choice-list");
  const quizContainer = document.getElementById("quiz-container");
  const resultContainer = document.getElementById("result-container");
  const startSection = document.getElementById("start-section");
  const scoreDisplay = document.getElementById("score");

  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let userAnswers = [];

  // Fetch questions from API
  async function fetchQuestions() {
    try {
      const res = await fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple");
      const data = await res.json();
      questions = data.results.map(q => ({
        question: q.question,
        choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        answer: q.correct_answer
      }));
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  }

  // Start quiz
  async function startQuiz() {
    await fetchQuestions();
    startSection.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    userAnswers = Array(questions.length).fill(null);
    showQuestion();
  }

  // Show current question
  function showQuestion() {
    const current = questions[currentQuestionIndex];
    questionText.innerHTML = `Q${currentQuestionIndex + 1}: ${current.question}`;
    choiceList.innerHTML = "";

    current.choices.forEach(choice => {
      const li = document.createElement("li");
      li.textContent = choice;
      li.className =
        "cursor-pointer px-4 py-2 rounded border border-gray-300 hover:bg-blue-100 transition";
      if (userAnswers[currentQuestionIndex] === choice) {
        li.classList.add("bg-blue-300", "font-semibold");
      }

      li.addEventListener("click", () => {
        userAnswers[currentQuestionIndex] = choice;
        if (choice === current.answer) {
          score++;
        } else if (userAnswers[currentQuestionIndex] !== current.answer && score > 0) {
          score--;
        }
        showQuestion(); // refresh to update selection color
        nextBtn.disabled = false;
      });

      choiceList.appendChild(li);
    });

    previousBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = !userAnswers[currentQuestionIndex];
  }

  // Navigate next/prev
  function navigateQuestion(direction) {
    currentQuestionIndex += direction;

    if (currentQuestionIndex >= questions.length) {
      showResult();
    } else {
      showQuestion();
    }
  }

  // Show result
  function showResult() {
    quizContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreDisplay.textContent = `${score} / ${questions.length}`;
  }

  // Restart quiz
  function restartQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add("hidden");
    startQuiz();
  }

  // Event Listeners
  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", () => navigateQuestion(1));
  previousBtn.addEventListener("click", () => navigateQuestion(-1));
  restartBtn.addEventListener("click", restartQuiz);
});
