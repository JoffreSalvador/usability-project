// === ESTADO GLOBAL Y ELEMENTOS DEL DOM ===
const gameState = {
    currentTutorialStep: 1,
    score: 0,
    timer: null,
    timeRemaining: 1200, // 20 minutos en segundos
    answers: [],
};

const screens = {
    tutorial: document.getElementById('tutorial-screen'),
    rules: document.getElementById('rules-screen'),
    game: document.getElementById('game-screen'),
    complete: document.getElementById('complete-screen'),
};

const quizData = [{ question: "1. In the speaker's model of a procrastinator's brain, who is at the wheel?", options: ["The Rational Decision-Maker", "The Instant Gratification Monkey", "The Panic Monster", "The Wise Owl"], answer: "The Instant Gratification Monkey" }, { question: "2. What is the one thing the 'Instant Gratification Monkey' cares about?", options: ["Long-term rewards", "Learning and growth", "Easy and fun", "Completing tasks"], answer: "Easy and fun" }, { question: "3. The speaker refers to the place where procrastinators spend their time as the...", options: ["The Happy Place", "The Stress Zone", "The Dark Playground", "The Productive Garden"], answer: "The Dark Playground" }, { question: "4. What is the 'Panic Monster'?", options: ["A part of the brain", "A real-world consequence", "A metaphor for the fear of deadlines", "A time management technique"], answer: "A metaphor for the fear of deadlines" }, { question: "5. The Panic Monster is the only thing the Instant Gratification Monkey is terrified of. When does it wake up?", options: ["When you start a new task", "When there's a risk of public embarrassment or a major career disaster", "Every morning", "When you feel happy"], answer: "When there's a risk of public embarrassment or a major career disaster" }, { question: "6. According to the speaker, what is the problem with procrastination in situations where there are no deadlines?", options: ["The Panic Monster never appears", "The work is not important", "It's a more efficient way to work", "The monkey goes on vacation"], answer: "The Panic Monster never appears" }, { question: "7. The two types of procrastination are those with deadlines and those without. Which type does the speaker say is more dangerous?", options: ["The one with deadlines", "The one without deadlines", "Both are equally dangerous", "Neither is dangerous"], answer: "The one without deadlines" }, { question: "8. What visual aid does the speaker use to represent a human life?", options: ["A timeline of historical events", "A pie chart of daily activities", "A calendar with one box for every week", "A pyramid of needs"], answer: "A calendar with one box for every week" }, { question: "9. Who is the person whose system is working, according to the speaker?", options: ["A non-procrastinator", "The master procrastinator", "The speaker himself", "No one's system is perfect"], answer: "A non-procrastinator" }, { question: "10. What is the speaker's final message to the audience?", options: ["We should all be a little bit scared of the Instant Gratification Monkey.", "We need to stay aware of the Instant Gratification Monkey.", "We should eliminate the monkey from our brains.", "We must learn to work faster."], answer: "We need to stay aware of the Instant Gratification Monkey." }];

// Elementos del DOM
const questionsContainer = document.getElementById('questions-container');
const quizForm = document.getElementById('quiz-form');
const submitBtn = document.getElementById('submit-btn');
const timerEl = document.getElementById('timer');
const alertModal = document.getElementById('alert-modal');
const alertOkBtn = document.getElementById('alert-ok-btn');
const finalScoreEl = document.getElementById('final-score');
const finalAccuracyEl = document.getElementById('final-accuracy');
const finalCorrectEl = document.getElementById('final-correct');
const performanceListEl = document.getElementById('performance-list');

document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    quizForm.addEventListener('submit', (e) => { e.preventDefault(); handleSubmit(); });
    if (alertModal) alertOkBtn.addEventListener('click', () => alertModal.style.display = 'none');

    // Añadimos un listener para gestionar la selección de opciones
    if (questionsContainer) {
        questionsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'radio' && e.target.name.startsWith('question')) {
                const questionName = e.target.name;
                const radios = document.querySelectorAll(`input[name="${questionName}"]`);
                // Quitamos la clase 'selected' de todas las opciones de la misma pregunta
                radios.forEach(radio => {
                    radio.parentElement.classList.remove('selected');
                });
                // Añadimos la clase 'selected' a la opción elegida
                e.target.parentElement.classList.add('selected');
            }
        });
    }
});

// === LÓGICA DE NAVEGACIÓN Y FLUJO ===
function showScreen(screenName) { Object.keys(screens).forEach(key => screens[key] && screens[key].classList.remove('active')); if (screens[screenName]) screens[screenName].classList.add('active'); }
function showTutorial() { showTutorialStep(1); showScreen('tutorial'); }
function showRules() { showScreen('rules'); }
function skipTutorial() { showScreen('rules'); }
function startGame() { resetGame(); startTimer(); showScreen('game'); }
function playAgain() { showTutorialStep(1); showScreen('tutorial'); }
function nextTutorial() { if (gameState.currentTutorialStep < 4) { gameState.currentTutorialStep++; showTutorialStep(gameState.currentTutorialStep); } }
function prevTutorial() { if (gameState.currentTutorialStep > 1) { gameState.currentTutorialStep--; showTutorialStep(gameState.currentTutorialStep); } }
function showTutorialStep(stepNum) {
    gameState.currentTutorialStep = stepNum;
    const steps = document.querySelectorAll('.tutorial-step');
    const dotContainers = document.querySelectorAll('.tutorial-dots');
    steps.forEach(step => step.classList.remove('active'));
    const activeStep = document.querySelector(`.tutorial-step[data-step="${stepNum}"]`);
    if (activeStep) activeStep.classList.add('active');
    dotContainers.forEach(container => {
        const dots = container.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === stepNum - 1) dot.classList.add('active');
        });
    });
}

// === LÓGICA DEL JUEGO ===
function loadQuiz() {
    if (!questionsContainer) return;
    let questionsHTML = '';
    quizData.forEach((quizItem, index) => {
        // Nueva estructura para cada bloque de pregunta
        questionsHTML += `
            <div class="question-block" id="question-${index}">
                <h3 class="question-text">${quizItem.question}</h3>
                <div class="options-container">
        `;
        quizItem.options.forEach((option, optionIndex) => {
            const optionId = `q${index}-opt${optionIndex}`;
            // Nueva estructura para cada opción
            questionsHTML += `
                    <div class="option">
                        <input type="radio" name="question${index}" id="${optionId}" value="${option}" />
                        <label for="${optionId}">${option}</label>
                    </div>
            `;
        });
        questionsHTML += `
                </div>
            </div>
        `;
    });
    questionsContainer.innerHTML = questionsHTML;
}

function handleSubmit(force = false) {
    const totalAnswered = document.querySelectorAll('input[type="radio"]:checked').length;
    if (totalAnswered < quizData.length && !force) {
        if (alertModal) {
            document.getElementById('modal-title').textContent = "Incomplete Answers";
            document.getElementById('modal-text').textContent = "Please answer all questions before submitting.";
            alertModal.style.display = 'flex';
        } else {
            alert("Please answer all questions before submitting.");
        }
        return;
    }

    // En la función handleSubmit:
    if (totalAnswered < quizData.length && !force) {
        if (alertModal) { // Intenta encontrar el modal
            document.getElementById('modal-title').textContent = "Incomplete Answers";
            document.getElementById('modal-text').textContent = "Please answer all questions before submitting.";
            alertModal.style.display = 'flex'; // ¡Y lo muestra!
        } else { // Si no lo encuentra, usa la alerta fea
            alert("Please answer all questions before submitting.");
        }
        return;
    }

    clearInterval(gameState.timer);
    gameState.score = 0;
    gameState.answers = [];

    quizData.forEach((quizItem, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const userAnswer = selectedOption ? selectedOption.value : "No answer";
        const isCorrect = userAnswer === quizItem.answer;
        // CAMBIO AQUÍ: de 100 a 10 puntos
        if (isCorrect) gameState.score += 10;
        gameState.answers.push({ question: quizItem.question, selected: userAnswer, correct: quizItem.answer, isCorrect });
    });

    scoreText.textContent = `Your final score is ${score} out of ${quizData.length}.`;

    // Guarda el score en localStorage (¡LÍNEA NUEVA!)
    localStorage.setItem("game3_score", score);

    // También lo guarda en Firestore
    saveVideoGameScoreToFirestore(score);

    resultsContainer.style.display = 'flex';
    submitBtn.style.display = 'none';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}



function resetQuiz() {
    resultsContainer.style.display = 'none';
    submitBtn.style.display = 'block';
    
    quizData.forEach((_, index) => {
        const questionArticle = document.getElementById(`q-article-${index}`);
        const feedbackEl = document.getElementById(`feedback-${index}`);
        questionArticle.classList.remove('correct', 'incorrect');
        feedbackEl.style.display = 'none';
    });

    quizForm.reset();
    document.querySelector('#game-screen .container').scrollIntoView({ behavior: 'smooth' });
}

function saveVideoGameScoreToFirestore(score) {
    // Nos aseguramos de que el usuario esté autenticado
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const db = firebase.firestore();
            db.collection('user').doc(user.uid).set(
                { game3_score: score },
                { merge: true }
            )
            .then(() => console.log("Video game score saved:", score))
            .catch((err) => console.error("Error saving score:", err));
        } else {
            console.log("User not logged in. Score not saved.");
        }
    });
}
