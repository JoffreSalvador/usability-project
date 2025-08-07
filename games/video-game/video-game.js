const gameState = {
    currentTutorialStep: 1,
};

const screens = {
    tutorial: document.getElementById('tutorial-screen'),
    rules: document.getElementById('rules-screen'),
    game: document.getElementById('game-screen'),
};

const quizData = [ { question: "1. In the speaker's model of a procrastinator's brain, who is at the wheel?", options: ["The Rational Decision-Maker", "The Instant Gratification Monkey", "The Panic Monster", "The Wise Owl"], answer: "The Instant Gratification Monkey", explanation: "The Rational Decision-Maker wants to do productive work, but the Instant Gratification Monkey often takes the wheel to do what's easy and fun." }, { question: "2. What is the one thing the 'Instant Gratification Monkey' cares about?", options: ["Long-term rewards", "Learning and growth", "Easy and fun", "Completing tasks"], answer: "Easy and fun", explanation: "The monkey lives entirely in the present moment. It has no memory of the past or concept of the future, so it optimizes for what is easy and fun right now." }, { question: "3. The speaker refers to the place where procrastinators spend their time as the...", options: ["The Happy Place", "The Stress Zone", "The Dark Playground", "The Productive Garden"], answer: "The Dark Playground", explanation: "It's called the 'Dark Playground' because the fun you have there is not earned, and it's overshadowed by guilt, anxiety, and dread." }, { question: "4. What is the 'Panic Monster'?", options: ["A part of the brain", "A real-world consequence", "A metaphor for the fear of deadlines", "A time management technique"], answer: "A metaphor for the fear of deadlines", explanation: "The Panic Monster is dormant most of the time but wakes up when a deadline gets too close, scaring the monkey away so the Rational Decision-Maker can take control." }, { question: "5. The Panic Monster is the only thing the Instant Gratification Monkey is terrified of. When does it wake up?", options: ["When you start a new task", "When there's a risk of public embarrassment or a major career disaster", "Every morning", "When you feel happy"], answer: "When there's a risk of public embarrassment or a major career disaster", explanation: "The Panic Monster appears only when the consequences of not acting become truly severe, such as failing a class or losing a job." }, { question: "6. According to the speaker, what is the problem with procrastination in situations where there are no deadlines?", options: ["The Panic Monster never appears", "The work is not important", "It's a more efficient way to work", "The monkey goes on vacation"], answer: "The Panic Monster never appears", explanation: "For long-term goals like 'exercise' or 'work on your novel', there are no hard deadlines. This means the Panic Monster doesn't get triggered, and procrastination can go on forever." }, { question: "7. The two types of procrastination are those with deadlines and those without. Which type does the speaker say is more dangerous?", options: ["The one with deadlines", "The one without deadlines", "Both are equally dangerous", "Neither is dangerous"], answer: "The one without deadlines", explanation: "Procrastination without deadlines is 'silent'. It's the source of long-term unhappiness and regret because dreams and ambitions can fade away without you noticing." }, { question: "8. What visual aid does the speaker use to represent a human life?", options: ["A timeline of historical events", "A pie chart of daily activities", "A calendar with one box for every week", "A pyramid of needs"], answer: "A calendar with one box for every week", explanation: "He shows a 'Life Calendar' with 90 years of weeks to illustrate that life is finite and we should be mindful of the limited time we have." }, { question: "9. Who is the person whose system is working, according to the speaker?", options: ["A non-procrastinator", "The master procrastinator", "The speaker himself", "No one's system is perfect"], answer: "A non-procrastinator", explanation: "The speaker contrasts the procrastinator's brain (with the monkey) with a non-procrastinator's brain, where the Rational Decision-Maker is firmly in control." }, { question: "10. What is the speaker's final message to the audience?", options: ["We should all be a little bit scared of the Instant Gratification Monkey.", "We need to stay aware of the Instant Gratification Monkey.", "We should eliminate the monkey from our brains.", "We must learn to work faster."], answer: "We need to stay aware of the Instant Gratification Monkey.", explanation: "His final point is that we all procrastinate, and we need to be conscious of the monkey's influence, especially on our long-term, deadline-free goals." } ];

const questionsContainer = document.getElementById('questions-container');
const quizForm = document.getElementById('quiz-form');
const resultsContainer = document.getElementById('results-container');
const scoreText = document.getElementById('score-text');
const submitBtn = document.getElementById('submit-btn');
const tryAgainBtn = document.getElementById('try-again-btn');

document.addEventListener('DOMContentLoaded', () => {
    showScreen('tutorial');
    loadQuiz(); 

    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleSubmit();
    });

    tryAgainBtn.addEventListener('click', resetQuiz);
});

function showScreen(screenName) {
    Object.keys(screens).forEach(key => screens[key].classList.remove('active'));
    if (screens[screenName]) screens[screenName].classList.add('active');
}

function showTutorial() {
    showTutorialStep(1);
    showScreen('tutorial');
}

function showRules() { showScreen('rules'); }
function skipTutorial() { showScreen('rules'); }
function startGame() { 
    resetQuiz(); 
    showScreen('game'); 
}

function nextTutorial() {
    if (gameState.currentTutorialStep < 4) {
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
    const steps = document.querySelectorAll('.tutorial-step');
    const dotContainers = document.querySelectorAll('.tutorial-dots');

    steps.forEach(step => step.classList.remove('active'));
    const activeStep = document.querySelector(`.tutorial-step[data-step="${stepNum}"]`);
    if (activeStep) {
        activeStep.classList.add('active');
    }

    dotContainers.forEach(container => {
        const dots = container.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[stepNum - 1]) {
            dots[stepNum - 1].classList.add('active');
        }
    });
}


function loadQuiz() {
    let questionsHTML = '';
    quizData.forEach((quizItem, index) => {
        const questionId = `question-${index}`;
        questionsHTML += `<article class="question" id="q-article-${index}"><p id="${questionId}">${quizItem.question}</p><ul class="options" role="radiogroup" aria-labelledby="${questionId}">`;
        quizItem.options.forEach(option => {
            const optionId = `q${index}-${option.replace(/\s+/g, '-')}`;
            questionsHTML += `<li><input type="radio" name="question${index}" id="${optionId}" value="${option}"><label for="${optionId}">${option}</label></li>`;
        });
        questionsHTML += `</ul><div class="feedback-message" id="feedback-${index}"></div></article>`;
    });
    questionsContainer.innerHTML = questionsHTML;
}

function handleSubmit() {
    let score = 0;
    quizData.forEach((quizItem, index) => {
        const questionArticle = document.getElementById(`q-article-${index}`);
        const feedbackEl = document.getElementById(`feedback-${index}`);
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        const userAnswer = selectedOption ? selectedOption.value : undefined;

        questionArticle.classList.remove('correct', 'incorrect');
        feedbackEl.style.display = 'none';

        if (userAnswer === quizItem.answer) {
            score++;
            questionArticle.classList.add('correct');
            feedbackEl.innerHTML = `<strong>Correct!</strong> ${quizItem.explanation}`;
            feedbackEl.className = 'feedback-message correct-feedback';
        } else {
            questionArticle.classList.add('incorrect');
            const correctAnswerText = `<strong>Correct Answer:</strong> ${quizItem.answer}.`;
            feedbackEl.innerHTML = `${correctAnswerText}<br>${quizItem.explanation}`;
            feedbackEl.className = 'feedback-message incorrect-feedback';
        }
        feedbackEl.style.display = 'block';
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
