const quizBank = [
  {
    question: "Which method converts JSON text into a JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "Object.assign()",
      "JSON.decode()",
    ],
    answer: "JSON.parse()",
  },
  {
    question: "What does DOM stand for?",
    options: [
      "Document Object Model",
      "Data Object Map",
      "Dynamic Output Module",
      "Display Object Method",
    ],
    answer: "Document Object Model",
  },
  {
    question: "Which keyword declares a block-scoped variable?",
    options: ["var", "let", "int", "float"],
    answer: "let",
  },
  {
    question:
      "Which array method creates a new array by running a function on each element?",
    options: ["forEach()", "filter()", "map()", "reduce()"],
    answer: "map()",
  },
  {
    question: "What is the output of typeof NaN?",
    options: ["number", "NaN", "undefined", "object"],
    answer: "number",
  },
  {
    question: "Which event fires when a form is submitted?",
    options: ["change", "submit", "click", "input"],
    answer: "submit",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Color Style Sheet",
      "Creative Style Syntax",
      "Cascading Style Sheets",
      "Computer Styled System",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question:
      "Which JavaScript feature lets you wait for an asynchronous result?",
    options: ["callback", "promise", "async/await", "all of the above"],
    answer: "all of the above",
  },
  {
    question: "Which method removes the last item from an array?",
    options: ["shift()", "pop()", "slice()", "splice()"],
    answer: "pop()",
  },
  {
    question: "Which symbol is used for strict equality in JavaScript?",
    options: ["==", "=", "===", "!="],
    answer: "===",
  },
  {
    question: "Which keyword stops a loop immediately?",
    options: ["continue", "break", "return", "stop"],
    answer: "break",
  },
  {
    question: "Which browser API is commonly used to store data for a session?",
    options: ["sessionStorage", "indexDB", "clipboardStorage", "cacheStorage"],
    answer: "sessionStorage",
  },
];

const TOTAL_QUESTIONS = 10;
const TIME_PER_QUESTION = 30;
const NEXT_DELAY = 900;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const feedbackText = document.getElementById("feedback-text");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const pointsText = document.getElementById("points-text");
const scoreText = document.getElementById("score-text");
const timerText = document.getElementById("timer-text");
const resultsCard = document.getElementById("results-card");
const restartBtn = document.getElementById("restart-btn");

let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let remainingSeconds = TIME_PER_QUESTION;
let timerId = null;
let locked = false;

function shuffle(array) {
  const copy = [...array];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function prepareQuiz() {
  quizQuestions = shuffle(quizBank)
    .slice(0, TOTAL_QUESTIONS)
    .map((entry) => ({
      ...entry,
      options: shuffle(entry.options),
    }));
}

function stopTimer() {
  if (timerId) {
    window.clearInterval(timerId);
    timerId = null;
  }
}

function updateHeader() {
  const questionNumber = currentQuestionIndex + 1;
  progressText.textContent = `Question ${questionNumber} of ${TOTAL_QUESTIONS}`;
  pointsText.textContent = `${score} correct`;
  scoreText.textContent = score;
  timerText.textContent = `${remainingSeconds}s`;
  progressFill.style.width = `${(questionNumber / TOTAL_QUESTIONS) * 100}%`;
}

function renderQuestion() {
  locked = false;
  stopTimer();
  remainingSeconds = TIME_PER_QUESTION;
  resultsCard.classList.add("hidden");
  resultsCard.innerHTML = "";
  feedbackText.textContent = "Select the best answer to continue.";
  updateHeader();

  const question = quizQuestions[currentQuestionIndex];
  questionText.textContent = question.question;
  optionsContainer.innerHTML = "";

  question.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option-btn";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(button, option));
    optionsContainer.appendChild(button);
  });

  timerId = window.setInterval(() => {
    remainingSeconds -= 1;
    timerText.textContent = `${remainingSeconds}s`;

    if (remainingSeconds <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function revealOptions(selectedButton, chosenAnswer, isTimeout = false) {
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const buttons = [...optionsContainer.querySelectorAll(".option-btn")];

  buttons.forEach((button) => {
    const isCorrect = button.textContent === currentQuestion.answer;
    button.disabled = true;
    if (isCorrect) {
      button.classList.add("correct");
    }
  });

  if (selectedButton) {
    const wasCorrect = chosenAnswer === currentQuestion.answer;
    selectedButton.classList.add(wasCorrect ? "correct" : "wrong");
  }

  feedbackText.textContent = isTimeout
    ? `Time's up. The correct answer was “${currentQuestion.answer}.”`
    : chosenAnswer === currentQuestion.answer
      ? "Correct. Moving to the next question."
      : `Not quite. The correct answer was “${currentQuestion.answer}.”`;
}

function goToNextQuestion() {
  currentQuestionIndex += 1;

  if (currentQuestionIndex >= TOTAL_QUESTIONS) {
    finishQuiz();
    return;
  }

  renderQuestion();
}

function selectAnswer(button, chosenAnswer) {
  if (locked) {
    return;
  }

  locked = true;
  stopTimer();

  if (chosenAnswer === quizQuestions[currentQuestionIndex].answer) {
    score += 1;
  }

  updateHeader();
  revealOptions(button, chosenAnswer, false);

  window.setTimeout(() => {
    goToNextQuestion();
  }, NEXT_DELAY);
}

function handleTimeout() {
  if (locked) {
    return;
  }

  locked = true;
  revealOptions(null, "", true);

  window.setTimeout(() => {
    goToNextQuestion();
  }, NEXT_DELAY);
}

function resultsMessage(percentage) {
  if (percentage >= 90) {
    return "Outstanding work. You handled the quiz with near-perfect precision.";
  }
  if (percentage >= 70) {
    return "Strong result. You know the core JavaScript concepts well.";
  }
  if (percentage >= 50) {
    return "Solid effort. A second run should help you push the score higher.";
  }
  return "Keep practicing. Restart the quiz and sharpen your fundamentals.";
}

function finishQuiz() {
  stopTimer();
  optionsContainer.innerHTML = "";
  questionText.textContent = "Quiz complete";
  feedbackText.textContent =
    "Review your result below or restart for a new shuffled attempt.";

  const percentage = Math.round((score / TOTAL_QUESTIONS) * 100);
  progressFill.style.width = "100%";
  progressText.textContent = `Question ${TOTAL_QUESTIONS} of ${TOTAL_QUESTIONS}`;
  pointsText.textContent = `${score} correct`;
  scoreText.textContent = score;
  timerText.textContent = "0s";

  resultsCard.classList.remove("hidden");
  resultsCard.innerHTML = `
		<h3>Your Results</h3>
		<div class="results-summary">
			<div class="result-box">
				<span>Score</span>
				<strong>${score} / ${TOTAL_QUESTIONS}</strong>
			</div>
			<div class="result-box">
				<span>Percentage</span>
				<strong>${percentage}%</strong>
			</div>
			<div class="result-box">
				<span>Status</span>
				<strong>${score === TOTAL_QUESTIONS ? "Perfect" : "Complete"}</strong>
			</div>
		</div>
		<p class="result-message">${resultsMessage(percentage)}</p>
	`;
}

function startQuiz() {
  stopTimer();
  prepareQuiz();
  currentQuestionIndex = 0;
  score = 0;
  remainingSeconds = TIME_PER_QUESTION;
  locked = false;
  renderQuestion();
}

restartBtn.addEventListener("click", startQuiz);

startQuiz();
