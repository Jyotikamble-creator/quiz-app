
document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("quiz-container");
  const questionText = document.getElementById("question-text");
  const choiceList = document.getElementById("choice-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");


  let questions = [];
  let currentQuestionIndex = 0;
  let score = 0;
  let selectedAnswers = {};
  // Total quiz time in seconds

  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", () => navigateQuestion(1));
  prevBtn.addEventListener("click", () => navigateQuestion(-1));
  restartBtn.addEventListener("click", restartQuiz);
  

 
  async function fetchQuestions() {
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      questions = data.results.map(q => ({
        question: q.question,
        choices: [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5),
        answer: q.correct_answer
      }));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  }

  


















 
    
  }
  if (choice === current.answer) {
          score++;
        } else if (userAnswers[currentQuestionIndex] !== current.answer && score > 0) {
          score--;
        }
        showQuestion(); // refresh to update selection color
        nextBtn.disabled = false;
 



});
