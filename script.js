// script for the page 
// call and store all the classes defined by id 
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-btn");
    const quizContainer = document.getElementById("quiz-container");
    const questionText = document.getElementById("question-text");
    const choiceList = document.getElementById("choice-list");
    const nextBtn = document.getElementById("next-btn");
    const prevBtn = document.getElementById("previous-btn");
    const restartBtn = document.getElementById("restart-btn");
    const resultContainer = document.getElementById("result-container");
    const scoreDisplay = document.getElementById("score");
    const progressBar = document.getElementById("progress-bar");
    const timerDisplay = document.getElementById("timer");
    const category = document.getElementById("category");
    const difficulty = document.getElementById("difficulty");
    const darkToggle = document.getElementById("dark-toggle");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedAnswers = {};
    let timer;
    let totalTime = 60;

    // Theme toggle for Tailwind (toggle on <html>)
    function setTheme(isDark) {
        const html = document.documentElement;
        if (isDark) {
            html.classList.add("dark");
            darkToggle.textContent = "☀️ Light Mode";
            localStorage.setItem("quiz-theme", "dark");
        } else {
            html.classList.remove("dark");
            darkToggle.textContent = "🌙 Dark Mode";
            localStorage.setItem("quiz-theme", "light");
        }
    }

    // Initial theme load
    setTheme(localStorage.getItem("quiz-theme") === "dark");

    darkToggle.addEventListener("click", () => {
        const isDark = !document.documentElement.classList.contains("dark");
        setTheme(isDark);
    });

    //   intialize the quiz
    startBtn.addEventListener("click", async () => {
        await fetchQuestions();
        currentQuestionIndex = 0;
        score = 0;
        selectedAnswers = {};
        document.getElementById("filters").classList.add("hidden");
        document.getElementById("start-section").classList.add("hidden");
        quizContainer.classList.remove("hidden");
        resultContainer.classList.add("hidden");
        startTimer();
        showQuestion();
    });

    //   this button fects the next question
    nextBtn.addEventListener("click", () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            showQuestion();
        } else {
            clearInterval(timer);
            showResult();
        }
    });

    //   this button moves back to last question
    prevBtn.addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion();
        }
    });

    //   this button restarts the quiz
    restartBtn.addEventListener("click", () => {
        document.getElementById("filters").classList.remove("hidden");
        document.getElementById("start-section").classList.remove("hidden");
        quizContainer.classList.add("hidden");
        resultContainer.classList.add("hidden");
        progressBar.style.width = "0%";
        timerDisplay.textContent = "⏳ Time Left: 00:00";

        // Reset theme for restart (preserves last mode)
        setTheme(localStorage.getItem("quiz-theme") === "dark");
    });

    //   timmer for the quiz 
    function startTimer() {
        let timeLeft = totalTime;
        updateTimer(timeLeft);
        timer = setInterval(() => {
            timeLeft--;
            updateTimer(timeLeft);
            if (timeLeft <= 0) {
                clearInterval(timer);
                showResult();
            }
        }, 1000);
    }

    //   updates the timer as the quiz starts
    function updateTimer(seconds) {
        const min = String(Math.floor(seconds / 60)).padStart(2, "0");
        const sec = String(seconds % 60).padStart(2, "0");
        timerDisplay.textContent = `⏳ Time Left: ${min}:${sec}`;
    }

    //   fetching the questions from the url
    async function fetchQuestions() {

        // url in not directly called it is stored in the variable
        let url = "https://opentdb.com/api.php?amount=10&type=multiple";
        if (category.value) url += `&category=${category.value}`;
        if (difficulty.value) url += `&difficulty=${difficulty.value}`;

        //   fetching the questions
        const res = await fetch(url);
        const data = await res.json();
        questions = data.results.map((q) => ({
            question: decodeHTML(q.question),
            choices: shuffle([...q.incorrect_answers.map(decodeHTML), decodeHTML(q.correct_answer)]),
            answer: decodeHTML(q.correct_answer),
        }));
    }

    //   displaying the question in the question bank
    function showQuestion() {
        const q = questions[currentQuestionIndex];
        questionText.innerHTML = q.question;
        choiceList.innerHTML = "";
        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = !selectedAnswers.hasOwnProperty(currentQuestionIndex);

        q.choices.forEach((choice) => {
            const li = document.createElement("li");
            li.textContent = choice;
            li.className = "p-2 rounded cursor-pointer transition-colors duration-200";

            // Theme for choices
            if (document.documentElement.classList.contains("dark")) {
                li.classList.add("bg-gray-200", "hover:bg-gray-700");
            } else {
                li.classList.add("bg-gray-200", "hover:bg-gray-300");
            }

            //   checking if the answer is selected
            // the correct answer will be green and the wrong answer will be red on selecting only it will display to user 
            if (selectedAnswers[currentQuestionIndex]) {
                li.classList.remove("hover:bg-gray-300", "hover:bg-gray-700");
                if (choice === q.answer) {
                    li.classList.add("bg-green-400", "text-white", "font-semibold", "border-2", "border-green-600");
                }
                if (choice === selectedAnswers[currentQuestionIndex] && choice !== q.answer) {
                    li.classList.add("bg-red-400", "text-white", "font-semibold", "border-2", "border-red-600");
                }
            }

            //   if the answer is correct it will count as a score
            li.addEventListener("click", () => {
                if (!selectedAnswers[currentQuestionIndex]) {
                    selectedAnswers[currentQuestionIndex] = choice;
                    if (choice === q.answer) score++;
                    showQuestion();
                }
            });

            choiceList.appendChild(li);
        });

        //   updating the progress bar as the question answer moving in forward
        progressBar.style.width = `${((currentQuestionIndex + 1) / questions.length) * 100}%`;
    }

    //   the whole result in shown at end of the quiz
    function showResult() {
        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden");
        scoreDisplay.textContent = `${score} / ${questions.length}`;
    }

    //   shuffling the choices
    function shuffle(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    //   decoding the html for the questions
    function decodeHTML(html) {
        var txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }
});