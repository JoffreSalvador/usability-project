// Vocabulary Game JavaScript Logic

// Global Game State
let gameState = {
  currentTutorialStep: 1,
  currentWord: 0,
  totalWords: 10,
  score: 0,
  timeRemaining: 30,
  timer: null,
  gameStartTime: null,
  answers: [],
  speedBonus: false,
};

// Game Data - Words with definitions
const gameData = {
  words: [
    {
      id: 1,
      word: "Serendipity",
      pronunciation: "/ˌserənˈdipedē/",
      type: "noun",
      question: "Choose the correct definition for this word:",
      options: [
        "The occurrence of events by chance in a happy or beneficial way",
        "A feeling of great sadness or disappointment",
        "The ability to understand something immediately",
        "A state of being extremely tired or exhausted",
      ],
      correct: 0,
      explanation:
        "Serendipity means finding something good without looking for it.",
      example:
        "Finding that book was pure serendipity - it was exactly what I needed for my research.",
    },
    {
      id: 2,
      word: "Resilient",
      pronunciation: "/rəˈzilyənt/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Extremely fragile and easily broken",
        "Able to recover quickly from difficult conditions",
        "Having a tendency to avoid challenges",
        "Being overly sensitive to criticism",
      ],
      correct: 1,
      explanation:
        "Resilient describes someone or something that can withstand or recover quickly from difficult conditions.",
      example:
        "She proved to be resilient after facing many challenges in her career.",
    },
    {
      id: 3,
      word: "Ephemeral",
      pronunciation: "/əˈfem(ə)rəl/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Lasting for a very long time",
        "Relating to the study of insects",
        "Lasting for a very short time",
        "Extremely valuable and rare",
      ],
      correct: 2,
      explanation:
        "Ephemeral describes something that lasts for a very short time.",
      example:
        "The beauty of the cherry blossoms is ephemeral, lasting only a few days each spring.",
    },
    {
      id: 4,
      word: "Pragmatic",
      pronunciation: "/praɡˈmadik/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Dealing with things in a theoretical way",
        "Focusing on artistic expression",
        "Dealing with things in a practical way",
        "Being overly idealistic",
      ],
      correct: 2,
      explanation:
        "Pragmatic means dealing with things sensibly and realistically.",
      example:
        "His pragmatic approach to problem-solving helped the company overcome the crisis.",
    },
    {
      id: 5,
      word: "Ubiquitous",
      pronunciation: "/yo͞oˈbikwədəs/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Present, appearing, or found everywhere",
        "Extremely rare and hard to find",
        "Relating to underwater environments",
        "Having a pleasant smell",
      ],
      correct: 0,
      explanation:
        "Ubiquitous describes something that seems to be everywhere at the same time.",
      example: "Mobile phones have become ubiquitous in modern society.",
    },
    {
      id: 6,
      word: "Eloquent",
      pronunciation: "/ˈeləkwənt/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Speaking many languages fluently",
        "Fluent or persuasive in speaking or writing",
        "Speaking very quietly",
        "Using complex vocabulary unnecessarily",
      ],
      correct: 1,
      explanation:
        "Eloquent describes someone who speaks or writes in a fluent and persuasive manner.",
      example:
        "The president gave an eloquent speech that inspired the nation.",
    },
    {
      id: 7,
      word: "Meticulous",
      pronunciation: "/məˈtikyələs/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Showing great attention to detail",
        "Being extremely fast in completing tasks",
        "Having a tendency to forget things",
        "Being overly critical of others",
      ],
      correct: 0,
      explanation:
        "Meticulous describes someone who shows great attention to detail.",
      example:
        "Her meticulous planning ensured the event went off without a hitch.",
    },
    {
      id: 8,
      word: "Collaborate",
      pronunciation: "/kəˈlabəˌrāt/",
      type: "verb",
      question: "Choose the correct definition for this word:",
      options: [
        "To work jointly with others on an activity or project",
        "To compete aggressively against others",
        "To carefully analyze a problem",
        "To delegate all responsibilities to others",
      ],
      correct: 0,
      explanation:
        "Collaborate means to work together with others to achieve a common goal.",
      example:
        "The two companies decided to collaborate on the new research project.",
    },
    {
      id: 9,
      word: "Versatile",
      pronunciation: "/ˈvərsədl/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Able to adapt or be adapted to many different functions",
        "Very stable and resistant to change",
        "Having a single, specialized purpose",
        "Being extremely fragile",
      ],
      correct: 0,
      explanation:
        "Versatile describes something that can adapt to many different functions or activities.",
      example: "She's a versatile musician who can play several instruments.",
    },
    {
      id: 10,
      word: "Ambiguous",
      pronunciation: "/amˈbiɡyo͞oəs/",
      type: "adjective",
      question: "Choose the correct definition for this word:",
      options: [
        "Open to more than one interpretation",
        "Completely clear and obvious",
        "Having a negative connotation",
        "Being overly complex",
      ],
      correct: 0,
      explanation:
        "Ambiguous describes something that is unclear or can be interpreted in more than one way.",
      example:
        "His ambiguous statement left everyone confused about his true intentions.",
    },
  ],
};

// DOM Elements
const screens = {
  tutorial: document.getElementById("tutorial-screen"),
  rules: document.getElementById("rules-screen"),
  game: document.getElementById("game-screen"),
  complete: document.getElementById("complete-screen"),
};

// Initialize Game
document.addEventListener("DOMContentLoaded", function () {
  initializeGame();
  setupEventListeners();
  showScreen("tutorial");
});

// Initialize game state and UI
function initializeGame() {
  gameState.currentWord = 0;
  gameState.score = 0;
  gameState.answers = [];
  updateGameUI();
}

// Setup event listeners
function setupEventListeners() {
  // Question options
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.addEventListener("click", selectOption);
  });

  // Keyboard navigation
  document.addEventListener("keydown", handleKeydown);
}

// Tutorial Functions
function nextTutorial() {
  if (gameState.currentTutorialStep < 6) {
    gameState.currentTutorialStep++;
    showTutorialStep(gameState.currentTutorialStep);
  }
}

function prevTutorial() {
  if (gameState.currentTutorialStep > 1) {
    gameState.currentTutorialStep--;
    showTutorialStep(gameState.currentTutorialStep);
  }
}

function showTutorialStep(stepNum) {
  gameState.currentTutorialStep = stepNum;
  const steps = document.querySelectorAll(".tutorial-step");
  const dotContainers = document.querySelectorAll(".tutorial-dots");

  steps.forEach((step) => step.classList.remove("active"));
  const activeStep = document.querySelector(
    `.tutorial-step[data-step="${stepNum}"]`
  );
  if (activeStep) {
    activeStep.classList.add("active");
  }

  dotContainers.forEach((container) => {
    const dots = container.querySelectorAll(".dot");
    dots.forEach((dot, index) => {
      dot.classList.remove("active");
      if (index === stepNum - 1) {
        dot.classList.add("active");
      }
    });
  });
}

function skipTutorial() {
  showRules();
}

// Screen Navigation
function showScreen(screenName) {
  Object.keys(screens).forEach((key) => {
    screens[key].classList.remove("active");
  });
  screens[screenName].classList.add("active");
}

function showTutorial() {
  gameState.currentTutorialStep = 1;
  showTutorialStep(1);
  showScreen("tutorial");
}

function showRules() {
  showScreen("rules");
}

function startGame() {
  gameState.currentWord = 0;
  gameState.score = 0;
  gameState.answers = [];
  gameState.timeRemaining = 30;

  if (gameState.timer) clearInterval(gameState.timer);

  document.getElementById("progress-fill").style.width = "0%";
  document.getElementById("question-section").style.display = "block";
  document.getElementById("feedback-section").style.display = "none";

  showScreen("game");

  loadCurrentWord();
  startTimer();
}

// Game Logic
function loadCurrentWord() {
  const word = gameData.words[gameState.currentWord];

  document.getElementById("word-title").textContent = word.word;
  document.getElementById("word-pronunciation").textContent =
    word.pronunciation;
  document.getElementById("word-type").textContent = word.type;

  document.getElementById("current-word").textContent = `Word ${
    gameState.currentWord + 1
  }`;
  document.getElementById("total-words").textContent = gameData.words.length;

  const progressPercentage =
    (gameState.currentWord / gameData.words.length) * 100;
  document.getElementById(
    "progress-fill"
  ).style.width = `${progressPercentage}%`;

  const optionsContainer = document.getElementById("options-container");
  optionsContainer.innerHTML = "";

  word.options.forEach((option, index) => {
    const optionEl = document.createElement("div");
    optionEl.className = "option";
    optionEl.setAttribute("data-option", index);
    optionEl.innerHTML = `
      <input type="radio" name="answer" id="option-${index}" value="${index}">
      <label for="option-${index}">${option}</label>
    `;
    optionEl.addEventListener("click", selectOption);
    optionsContainer.appendChild(optionEl);
  });
}

function selectOption(event) {
  // Remove previous selections
  document.querySelectorAll(".option").forEach((opt) => {
    opt.classList.remove("selected");
  });

  // Add selection to clicked option
  const option = event.currentTarget;
  option.classList.add("selected");

  // Check the radio button
  const radio = option.querySelector('input[type="radio"]');
  radio.checked = true;

  // Enable submit button
  document.getElementById("submit-btn").disabled = false;
}

function submitAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');
  if (!selectedOption) return;

  const answerIndex = parseInt(selectedOption.value);
  const word = gameData.words[gameState.currentWord];
  const isCorrect = answerIndex === word.correct;
  const responseTime = 30 - gameState.timeRemaining;
  const hasSpeedBonus = responseTime <= 15;

  // Stop timer
  clearInterval(gameState.timer);

  // Calculate points
  let points = 0;
  if (isCorrect) {
    points = 10;
    if (hasSpeedBonus) {
      points += 5;
    }
  }

  // Update score
  gameState.score += points;
  document.getElementById("current-score").textContent = gameState.score;

  // Store answer
  gameState.answers.push({
    wordId: word.id,
    word: word.word,
    selectedAnswer: answerIndex,
    correctAnswer: word.correct,
    isCorrect: isCorrect,
    points: points,
    responseTime: responseTime,
    hasSpeedBonus: hasSpeedBonus,
  });

  // Show feedback
  showFeedback(isCorrect, points, word, hasSpeedBonus);

  // Update option styles
  updateOptionStyles(answerIndex, word.correct);
}

function updateOptionStyles(selectedIndex, correctIndex) {
  const options = document.querySelectorAll(".option");
  options.forEach((option, index) => {
    if (index === correctIndex) {
      option.classList.add("correct");
    } else if (index === selectedIndex && index !== correctIndex) {
      option.classList.add("incorrect");
    }
  });
}

function showFeedback(isCorrect, points, word, hasSpeedBonus) {
  const feedbackSection = document.getElementById("feedback-section");
  const feedbackContent = document.getElementById("feedback-content");

  feedbackSection.className = `feedback-section ${
    isCorrect ? "feedback-correct" : "feedback-incorrect"
  }`;

  let pointsText = "";
  if (isCorrect) {
    pointsText = `+${points} points`;
    if (hasSpeedBonus) {
      pointsText += " (includes speed bonus!)";
    }
  } else {
    pointsText = "No points earned";
  }

  feedbackContent.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-icon">${isCorrect ? "✅" : "❌"}</div>
            <h3 class="feedback-title">${
              isCorrect ? "Correct!" : "Incorrect"
            }</h3>
        </div>
        <div class="feedback-points">${pointsText}</div>
        <div class="feedback-explanation">
            <strong>${
              isCorrect ? "Great job!" : "Correct Definition:"
            }</strong> 
            ${isCorrect ? word.explanation : word.options[word.correct]}
        </div>
        <div class="feedback-example">
            <strong>Example:</strong> ${word.example}
        </div>
    `;

  // Hide question section and show feedback
  document.getElementById("question-section").style.display = "none";
  feedbackSection.style.display = "block";

  // Update next button text
  const nextBtn = document.getElementById("next-btn");
  if (gameState.currentWord >= gameState.totalWords - 1) {
    nextBtn.textContent = "View Results →";
    nextBtn.onclick = showResults;
  } else {
    nextBtn.textContent = "Next Word →";
    nextBtn.onclick = nextWord;
  }
}

function nextWord() {
  gameState.currentWord++;

  const progressPercentage =
    (gameState.currentWord / gameData.words.length) * 100;
  document.getElementById(
    "progress-fill"
  ).style.width = `${progressPercentage}%`;

  if (gameState.currentWord >= gameData.words.length) {
    showResults();
  } else {
    document.getElementById("question-section").style.display = "block";
    document.getElementById("feedback-section").style.display = "none";
    loadCurrentWord();
    gameState.timeRemaining = 30;
    startTimer();
  }
}

// Timer Functions
function startTimer() {
  if (gameState.timer) {
    clearInterval(gameState.timer);
  }

  gameState.timeRemaining = 30;
  updateTimerDisplay();

  gameState.timer = setInterval(() => {
    gameState.timeRemaining--;
    updateTimerDisplay();

    if (gameState.timeRemaining <= 0) {
      clearInterval(gameState.timer);
      timeUp();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = `${gameState.timeRemaining}s`;

  // Change color based on remaining time
  if (gameState.timeRemaining <= 10) {
    timerElement.style.color = "#dc3545";
  } else if (gameState.timeRemaining <= 20) {
    timerElement.style.color = "#ffc107";
  } else {
    timerElement.style.color = "#ff6b35";
  }
}

function timeUp() {
  // Auto-submit with no answer selected
  const word = gameData.words[gameState.currentWord];

  // Store answer as incorrect
  gameState.answers.push({
    wordId: word.id,
    word: word.word,
    selectedAnswer: -1, // No answer selected
    correctAnswer: word.correct,
    isCorrect: false,
    points: 0,
    responseTime: 30,
    hasSpeedBonus: false,
  });

  // Show feedback for time up
  showFeedback(false, 0, word, false);

  // Update feedback content for time up scenario
  const feedbackContent = document.getElementById("feedback-content");
  feedbackContent.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-icon">⏰</div>
            <h3 class="feedback-title">Time's Up!</h3>
        </div>
        <div class="feedback-points">No points earned</div>
        <div class="feedback-explanation">
            <strong>Correct Definition:</strong> ${word.options[word.correct]}
        </div>
        <div class="feedback-example">
            <strong>Example:</strong> ${word.example}
        </div>
    `;

  // Highlight correct answer
  const options = document.querySelectorAll(".option");
  options.forEach((option, index) => {
    if (index === word.correct) {
      option.classList.add("correct");
    }
  });
}

// Results and Completion
function showResults() {
  while (gameState.answers.length < gameData.words.length) {
    const word = gameData.words[gameState.answers.length];
    gameState.answers.push({
      wordId: word.id,
      word: word.word,
      selectedAnswer: -1,
      correctAnswer: word.correct,
      isCorrect: false,
      points: 0,
      responseTime: 30,
      hasSpeedBonus: false,
    });
  }

  calculateFinalStats();
  displayPerformanceSummary();
  showScreen("complete");
}

function calculateFinalStats() {
  const totalQuestions = gameState.answers.length;
  const correctAnswers = gameState.answers.filter(
    (answer) => answer.isCorrect
  ).length;
  const accuracy =
    totalQuestions > 0
      ? Math.round((correctAnswers / totalQuestions) * 100)
      : 0;

  // Update final stats display
  document.getElementById("final-score").textContent = gameState.score;
  document.getElementById("final-accuracy").textContent = `${accuracy}%`;
  document.getElementById(
    "final-correct"
  ).textContent = `${correctAnswers}/${totalQuestions}`;
}

function displayPerformanceSummary() {
  const performanceList = document.getElementById("performance-list");
  performanceList.innerHTML = "";

  gameState.answers.forEach((answer) => {
    const performanceItem = document.createElement("div");
    performanceItem.className = `performance-item ${
      answer.isCorrect ? "correct" : "incorrect"
    }`;

    const resultBadge = answer.isCorrect
      ? '<span class="result-badge correct">Correct</span>'
      : '<span class="result-badge incorrect">Incorrect</span>';

    const speedBonusText = answer.hasSpeedBonus ? " (Speed Bonus!)" : "";

    performanceItem.innerHTML = `
            <div class="performance-details">
                <div class="performance-title">${answer.word}</div>
                <div class="performance-description">
                    ${
                      answer.selectedAnswer === -1
                        ? "No answer given (time up)"
                        : gameData.words.find((w) => w.id === answer.wordId)
                            .options[answer.selectedAnswer]
                    }
                </div>
            </div>
            <div class="performance-result">
                ${resultBadge}
                <span class="result-points">${
                  answer.points
                }pts${speedBonusText}</span>
            </div>
        `;

    performanceList.appendChild(performanceItem);
  });
}

function playAgain() {
  // Reset game state
  gameState.currentWord = 0;
  gameState.score = 0;
  gameState.answers = [];
  gameState.timeRemaining = 30;

  // Clear any timers
  if (gameState.timer) clearInterval(gameState.timer);

  // Reset UI elements
  document.getElementById("question-section").style.display = "block";
  document.getElementById("feedback-section").style.display = "none";

  // Start new game
  startGame();
}

function goToDashboard() {
  window.location.href = "games.html";
}

// Keyboard Navigation
function handleKeydown(event) {
  const activeScreen = document.querySelector(".screen.active");
  const activeScreenId = activeScreen ? activeScreen.id : "";

  switch (event.key) {
    case "Enter":
    case " ":
      // Handle enter/space on focused elements
      if (document.activeElement.tagName === "BUTTON") {
        event.preventDefault();
        document.activeElement.click();
      } else if (document.activeElement.classList.contains("option")) {
        event.preventDefault();
        document.activeElement.click();
      }
      break;

    case "ArrowUp":
    case "ArrowDown":
      // Navigate through options
      if (activeScreenId === "game-screen") {
        event.preventDefault();
        navigateOptions(event.key === "ArrowUp" ? -1 : 1);
      }
      break;

    case "ArrowLeft":
    case "ArrowRight":
      // Navigate tutorial steps
      if (activeScreenId === "tutorial-screen") {
        event.preventDefault();
        if (event.key === "ArrowRight") {
          nextTutorial();
        } else {
          prevTutorial();
        }
      }
      break;

    case "1":
    case "2":
    case "3":
    case "4":
      // Quick select options
      if (activeScreenId === "game-screen") {
        const optionIndex = parseInt(event.key) - 1;
        const option = document.querySelector(`[data-option="${optionIndex}"]`);
        if (option) {
          option.click();
        }
      }
      break;
  }
}

function navigateOptions(direction) {
  const options = document.querySelectorAll(".option");
  const currentIndex = Array.from(options).findIndex(
    (option) =>
      option === document.activeElement ||
      option.contains(document.activeElement)
  );

  let nextIndex;
  if (currentIndex === -1) {
    nextIndex = direction > 0 ? 0 : options.length - 1;
  } else {
    nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = options.length - 1;
    if (nextIndex >= options.length) nextIndex = 0;
  }

  if (options[nextIndex]) {
    options[nextIndex].focus();
  }
}

// Initialize game when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeGame);
} else {
  initializeGame();
}
