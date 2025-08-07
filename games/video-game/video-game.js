// Guarda el puntaje del video-game en Firestore
function saveVideoGameScoreToFirestore(score) {
    if (typeof firebase === 'undefined' || !firebase.auth) {
        console.warn("Firebase no está cargado.");
        return;
    }
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            const db = firebase.firestore();
            db.collection('user').doc(user.uid).set(
                { game3_score: score },
                { merge: true }
            )
            .then(() => console.log("Video game score saved:", score))
            .catch((err) => console.error("Error saving video game score:", err));
        } else {
            console.log("User not logged in. Score not saved.");
        }
    });
}
// === ESTADO GLOBAL Y ELEMENTOS DEL DOM ===
const gameState = {
    currentTutorialStep: 1,
    score: 0,
    timer: null,
    timeRemaining: 1200, // 20 minutos
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

// Modales y transcripción
const alertModal = document.getElementById('alert-modal');
const alertOkBtn = document.getElementById('alert-ok-btn');
const transcriptModal = document.getElementById('transcript-modal');
const transcriptBtn = document.getElementById('transcript-btn');
const transcriptCloseBtn = document.getElementById('transcript-close-btn');
const transcriptTextContainer = document.getElementById('transcript-text');

// Resultados
const finalScoreEl = document.getElementById('final-score');
const finalAccuracyEl = document.getElementById('final-accuracy');
const finalCorrectEl = document.getElementById('final-correct');
const performanceListEl = document.getElementById('performance-list');

// Texto de la Transcripción para el video
const videoTranscript = `<p>So in college, I was a government major, which means I had to write a lot of papers. Now, when a normal student writes a paper, they might spread the work out a little like this. And you know, so they'd start maybe a little bit, and they get a little bit more done, and then they'd have the big push at the end and they'd be done.</p><p>But I had a different approach. I would start by doing nothing for a while. Then, I would do a little bit, get distracted, and do nothing again. This would continue until the deadline was very close. Then, the Panic Monster would wake up. The Panic Monster is the only thing the Instant Gratification Monkey is terrified of.</p><p>This system has its problems. It can lead to a lot of stress and lower-quality work. The real issue is with procrastination that doesn't have a deadline. If you want to start a business or learn a new skill, there's no deadline to trigger the Panic Monster. This is the kind of procrastination that can go on forever, and it's much more dangerous.</p><p>So, we're all procrastinators. The key is to be aware of the Instant Gratification Monkey and make a conscious effort to stay in control. Thank you.</p>`;

document.addEventListener('DOMContentLoaded', () => {
    loadQuiz();
    loadTranscript(); // Cargar transcripción al iniciar

    // Event listeners
    quizForm.addEventListener('submit', (e) => { e.preventDefault(); handleSubmit(); });
    if (alertModal) alertOkBtn.addEventListener('click', () => alertModal.style.display = 'none');
    if (transcriptBtn) transcriptBtn.addEventListener('click', () => transcriptModal.style.display = 'flex');
    if (transcriptCloseBtn) transcriptCloseBtn.addEventListener('click', () => transcriptModal.style.display = 'none');

    if (questionsContainer) {
        questionsContainer.addEventListener('change', (e) => {
            if (e.target.type === 'radio' && e.target.name.startsWith('question')) {
                const currentQuestionBlock = e.target.closest('.question-block');
                const labels = currentQuestionBlock.querySelectorAll('label.option');
                labels.forEach(label => {
                    label.classList.remove('selected');
                });
                e.target.parentElement.classList.add('selected');
            }
        });
    }
});

function showScreen(screenName) {
    Object.keys(screens).forEach(key => screens[key] && screens[key].classList.remove('active'));
    if (screens[screenName]) screens[screenName].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showTutorial() { showTutorialStep(1); showScreen('tutorial'); }
function showRules() { showScreen('rules'); }
function skipTutorial() { showScreen('rules'); }
function startGame() { resetGame(); startTimer(); showScreen('game'); }

function playAgain() {
    showTutorialStep(1);
    showScreen('tutorial');
}

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function loadQuiz() {
    if (!questionsContainer) return;
    let questionsHTML = '';
    quizData.forEach((quizItem, index) => {
        questionsHTML += `<div class="question-block" id="question-${index}"><h3 class="question-text">${quizItem.question}</h3><div class="options-container">`;
        quizItem.options.forEach((option, optionIndex) => {
            const optionId = `q${index}-opt${optionIndex}`;
            questionsHTML += `<label class="option" for="${optionId}"><input type="radio" name="question${index}" id="${optionId}" value="${option}" />${option}</label>`;
        });
        questionsHTML += `</div></div>`;
    });
    questionsContainer.innerHTML = questionsHTML;
}

// Nueva función para cargar la transcripción en el modal
function loadTranscript() {
    if (transcriptTextContainer) {
        transcriptTextContainer.innerHTML = videoTranscript;
    }
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
    clearInterval(gameState.timer);
    gameState.score = 0;
    gameState.answers = [];
    quizData.forEach((quizItem, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const userAnswer = selectedOption ? selectedOption.value : "No answer";
        const isCorrect = userAnswer === quizItem.answer;
        if (isCorrect) gameState.score += 10;
        gameState.answers.push({ question: quizItem.question, selected: userAnswer, correct: quizItem.answer, isCorrect });
    });
    showResults();
}

function resetGame() {
    gameState.score = 0;
    gameState.timeRemaining = 1200; // Revertido a 20 minutos
    gameState.answers = [];
    if (gameState.timer) clearInterval(gameState.timer);
    quizForm.reset();
    document.querySelectorAll('label.option.selected').forEach(el => el.classList.remove('selected'));
    if (timerEl) timerEl.textContent = '20:00'; // Revertido a 20 minutos
}

function startTimer() {
    updateTimerDisplay();
    gameState.timer = setInterval(() => {
        gameState.timeRemaining--;
        updateTimerDisplay();
        if (gameState.timeRemaining <= 0) {
            clearInterval(gameState.timer);
            if (alertModal) {
                document.getElementById('modal-title').textContent = "Time's Up!";
                document.getElementById('modal-text').textContent = "Your answers will be submitted automatically.";
                alertModal.style.display = 'flex';
                alertOkBtn.onclick = () => {
                    alertModal.style.display = 'none';
                    handleSubmit(true);
                    alertOkBtn.onclick = () => alertModal.style.display = 'none';
                };
            } else {
                alert("Time's Up!");
                handleSubmit(true);
            }
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(gameState.timeRemaining / 60);
    const seconds = gameState.timeRemaining % 60;
    if (timerEl) {
        timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerEl.style.color = gameState.timeRemaining <= 60 ? '#dc3545' : '#ff6b35';
    }
}

function showResults() {
    const correctAnswers = gameState.answers.filter(a => a.isCorrect).length;
    const accuracy = (correctAnswers / quizData.length) * 100;
    if (finalScoreEl) finalScoreEl.textContent = gameState.score;
    if (finalAccuracyEl) finalAccuracyEl.textContent = `${Math.round(accuracy)}%`;
    if (finalCorrectEl) finalCorrectEl.textContent = `${correctAnswers}/${quizData.length}`;
    if (performanceListEl) {
        performanceListEl.innerHTML = '';
        gameState.answers.forEach(answer => {
            const item = document.createElement('div');
            item.className = `performance-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
            const resultBadge = `<span class="result-badge ${answer.isCorrect ? 'correct' : 'incorrect'}">${answer.isCorrect ? 'Correct' : 'Incorrect'}</span>`;
            let answerDetailsHTML = '';
            if (answer.isCorrect) {
                answerDetailsHTML = `<div class="performance-description">Answer: <strong>${answer.correct}</strong></div>`;
            } else {
                answerDetailsHTML = `
                    <div class="performance-description">Your answer: <strong>${answer.selected}</strong></div>
                    <div class="performance-description incorrect-answer">Correct answer: <strong>${answer.correct}</strong></div>
                `;
            }
            item.innerHTML = `
                <div class="performance-details">
                    <div class="performance-title">${answer.question.substring(answer.question.indexOf('.') + 2)}</div>
                    ${answerDetailsHTML}
                </div>
                <div class="performance-result">${resultBadge}</div>`;
            performanceListEl.appendChild(item);
        });
    }
    // Guardar el puntaje en Firestore (como porcentaje entero)
    saveVideoGameScoreToFirestore(Math.round(accuracy));
    showScreen('complete');
}