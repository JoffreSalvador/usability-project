// Listening Game JavaScript Logic

// Global Game State
let gameState = {
    currentTutorialStep: 1,
    currentStory: 0,
    totalStories: 5,
    score: 0,
    timeRemaining: 45,
    timer: null,
    audioTimer: null,
    currentAudioTime: 0,
    totalAudioTime: 0,
    isPlaying: false,
    gameStartTime: null,
    answers: [],
    speedBonus: false
};

// Game Data - Stories with questions
const gameData = {
    stories: [
        {
            id: 1,
            title: "A Morning at the Coffee Shop",
            difficulty: "Intermediate",
            audioText: "Sarah walked into her favorite coffee shop on Monday morning. The barista smiled and said 'Good morning! The usual?' Sarah nodded but then noticed something different about the menu. There was a new drink she had never seen before called the 'Autumn Blend Coffee'. She was curious about the seasonal flavor and decided to try it instead of her regular order.",
            question: "What did Sarah order at the coffee shop?",
            options: [
                "A large cappuccino with extra foam",
                "Her usual morning coffee",
                "The new seasonal Autumn Blend Coffee", 
                "A simple black coffee"
            ],
            correct: 2,
            explanation: "Sarah was curious about the new 'Autumn Blend Coffee' and decided to try it instead of her usual order.",
            example: "The text mentions 'She was curious about the seasonal flavor and decided to try it instead of her regular order.'"
        },
        {
            id: 2,
            title: "Job Interview Conversation",
            difficulty: "Advanced",
            audioText: "Mark arrived at the office building fifteen minutes early for his job interview. He introduced himself to the receptionist and waited nervously in the lobby. When the interviewer called his name, Mark stood up confidently, shook hands, and followed her to a bright conference room. The interviewer began by asking about his previous work experience and why he was interested in the position.",
            question: "How early did Mark arrive for his interview?",
            options: [
                "Five minutes early",
                "Ten minutes early", 
                "Fifteen minutes early",
                "Twenty minutes early"
            ],
            correct: 2,
            explanation: "Mark arrived fifteen minutes early to make a good impression.",
            example: "The text clearly states 'Mark arrived at the office building fifteen minutes early for his job interview.'"
        },
        {
            id: 3,
            title: "Planning a Weekend Trip",
            difficulty: "Intermediate",
            audioText: "Emma and her friends were discussing their weekend plans over lunch. They wanted to visit the mountains for hiking and fresh air. Emma suggested leaving early Saturday morning and returning Sunday evening. Her friend Lisa recommended bringing camping equipment so they could stay overnight under the stars. Everyone agreed it would be more adventurous than staying in a hotel.",
            question: "What did Lisa recommend bringing?",
            options: [
                "Extra food and water",
                "Warm clothes for the mountains",
                "Camping equipment for overnight stay",
                "A map and compass for hiking"
            ],
            correct: 2,
            explanation: "Lisa recommended bringing camping equipment so they could stay overnight under the stars.",
            example: "The text mentions 'Lisa recommended bringing camping equipment so they could stay overnight under the stars.'"
        },
        {
            id: 4,
            title: "Restaurant Order Mix-up",
            difficulty: "Beginner",
            audioText: "Tom and his girlfriend went to their favorite Italian restaurant for dinner. Tom ordered the seafood pasta while his girlfriend chose the vegetarian pizza. After waiting twenty minutes, the waiter brought their food, but there was a mistake. Tom received the pizza and his girlfriend got the pasta. They politely asked the waiter to switch the dishes, and he apologized for the confusion.",
            question: "What mistake did the waiter make?",
            options: [
                "He brought the wrong drinks",
                "He forgot to bring bread",
                "He switched their food orders",
                "He brought the check too early"
            ],
            correct: 2,
            explanation: "The waiter mixed up their orders - Tom got the pizza instead of pasta, and his girlfriend got the pasta instead of pizza.",
            example: "The text explains 'Tom received the pizza and his girlfriend got the pasta' which was opposite to what they ordered."
        },
        {
            id: 5,
            title: "Phone Call About Delivery",
            difficulty: "Advanced",
            audioText: "Maria was expecting an important package delivery today. Around noon, she received a phone call from the delivery company. The driver explained that he couldn't find her apartment building because the address was incomplete. Maria quickly provided the missing apartment number and additional directions. The driver said he would try again within the next hour and successfully delivered the package before 2 PM.",
            question: "Why couldn't the driver find Maria's apartment initially?",
            options: [
                "The building was under construction",
                "The address was incomplete",
                "There was heavy traffic in the area", 
                "The GPS wasn't working properly"
            ],
            correct: 1,
            explanation: "The driver couldn't find the apartment because the address was incomplete - it was missing the apartment number.",
            example: "The text states 'he couldn't find her apartment building because the address was incomplete.'"
        }
    ]
};

// DOM Elements
const screens = {
    tutorial: document.getElementById('tutorial-screen'),
    rules: document.getElementById('rules-screen'),
    game: document.getElementById('game-screen'),
    complete: document.getElementById('complete-screen')
};

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
    setupEventListeners();
    showScreen('tutorial');
});

// Initialize game state and UI
function initializeGame() {
    gameState.currentStory = 0;
    gameState.score = 0;
    gameState.answers = [];
    updateGameUI();
}

// Setup event listeners
function setupEventListeners() {
    // Audio controls
    document.getElementById('play-btn').addEventListener('click', playAudio);
    document.getElementById('pause-btn').addEventListener('click', pauseAudio);
    document.getElementById('restart-btn').addEventListener('click', restartAudio);
    document.getElementById('volume-btn').addEventListener('click', toggleVolume);
    document.getElementById('speed-btn').addEventListener('click', changeSpeed);
    document.getElementById('transcript-btn').addEventListener('click', showTranscript);
    
    // Question options
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', selectOption);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeydown);
}

// Tutorial Functions
function nextTutorial() {
    if (gameState.currentTutorialStep < 5) {
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

function showTutorialStep(step) {
    const steps = document.querySelectorAll('.tutorial-step');
    const dots = document.querySelectorAll('.tutorial-dots .dot');
    
    steps.forEach((stepEl, index) => {
        stepEl.classList.toggle('active', index + 1 === step);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index + 1 === step);
    });
}

function skipTutorial() {
    showRules();
}

// Screen Navigation
function showScreen(screenName) {
    Object.keys(screens).forEach(key => {
        screens[key].classList.remove('active');
    });
    
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

function showTutorial() {
    gameState.currentTutorialStep = 1;
    showTutorialStep(1);
    showScreen('tutorial');
}

function showRules() {
    showScreen('rules');
}

function startGame() {
    gameState.gameStartTime = Date.now();
    gameState.currentStory = 0;
    loadCurrentStory();
    showScreen('game');
    startTimer();
}

// Game Logic
function loadCurrentStory() {
    const story = gameData.stories[gameState.currentStory];
    if (!story) return;
    
    // Update story info
    document.getElementById('current-story').textContent = `Story ${gameState.currentStory + 1}`;
    document.getElementById('total-stories').textContent = gameState.totalStories;
    document.querySelector('#story-title').textContent = story.title;
    document.querySelector('#difficulty-badge').textContent = story.difficulty;
    
    // Update progress bar
    const progress = ((gameState.currentStory) / gameState.totalStories) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    
    // Load question and options
    document.getElementById('question-text').textContent = story.question;
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    story.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'option';
        optionEl.setAttribute('data-option', index);
        optionEl.innerHTML = `
            <input type="radio" name="answer" id="option-${index}" value="${index}">
            <label for="option-${index}">${option}</label>
        `;
        optionEl.addEventListener('click', selectOption);
        optionsContainer.appendChild(optionEl);
    });
    
    // Update transcript
    document.getElementById('transcript-text').textContent = story.audioText;
    
    // Reset audio state
    resetAudioPlayer();
    
    // Hide feedback section
    document.getElementById('feedback-section').style.display = 'none';
    document.getElementById('question-section').style.display = 'block';
    
    // Reset timer
    gameState.timeRemaining = 45;
    gameState.timer = null;
    startTimer();
}

function selectOption(event) {
    // Remove previous selections
    document.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Add selection to clicked option
    const option = event.currentTarget;
    option.classList.add('selected');
    
    // Check the radio button
    const radio = option.querySelector('input[type="radio"]');
    radio.checked = true;
    
    // Enable submit button
    document.getElementById('submit-btn').disabled = false;
}

function submitAnswer() {
    const selectedOption = document.querySelector('input[name="answer"]:checked');
    if (!selectedOption) return;
    
    const answerIndex = parseInt(selectedOption.value);
    const story = gameData.stories[gameState.currentStory];
    const isCorrect = answerIndex === story.correct;
    const responseTime = 45 - gameState.timeRemaining;
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
    document.getElementById('current-score').textContent = gameState.score;
    
    // Store answer
    gameState.answers.push({
        storyId: story.id,
        storyTitle: story.title,
        selectedAnswer: answerIndex,
        correctAnswer: story.correct,
        isCorrect: isCorrect,
        points: points,
        responseTime: responseTime,
        hasSpeedBonus: hasSpeedBonus
    });
    
    // Show feedback
    showFeedback(isCorrect, points, story, hasSpeedBonus);
    
    // Update option styles
    updateOptionStyles(answerIndex, story.correct);
}

function updateOptionStyles(selectedIndex, correctIndex) {
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            option.classList.add('incorrect');
        }
    });
}

function showFeedback(isCorrect, points, story, hasSpeedBonus) {
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackContent = document.getElementById('feedback-content');
    
    feedbackSection.className = `feedback-section ${isCorrect ? 'feedback-correct' : 'feedback-incorrect'}`;
    
    let pointsText = '';
    if (isCorrect) {
        pointsText = `+${points} points`;
        if (hasSpeedBonus) {
            pointsText += ' (includes speed bonus!)';
        }
    } else {
        pointsText = 'No points earned';
    }
    
    feedbackContent.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
            <h3 class="feedback-title">${isCorrect ? 'Correct!' : 'Incorrect'}</h3>
        </div>
        <div class="feedback-points">${pointsText}</div>
        <div class="feedback-explanation">
            <strong>${isCorrect ? 'Great job!' : 'Correct Answer:'}</strong> 
            ${isCorrect ? story.explanation : story.options[story.correct]}
        </div>
        <div class="feedback-example">
            <strong>Example:</strong> ${story.example}
        </div>
    `;
    
    // Hide question section and show feedback
    document.getElementById('question-section').style.display = 'none';
    feedbackSection.style.display = 'block';
    
    // Update next button text
    const nextBtn = document.getElementById('next-btn');
    if (gameState.currentStory >= gameState.totalStories - 1) {
        nextBtn.textContent = 'View Results →';
        nextBtn.onclick = showResults;
    } else {
        nextBtn.textContent = 'Next Story →';
        nextBtn.onclick = nextStory;
    }
}

function nextStory() {
    gameState.currentStory++;
    if (gameState.currentStory >= gameState.totalStories) {
        showResults();
    } else {
        loadCurrentStory();
    }
}

// Timer Functions
function startTimer() {
    if (gameState.timer) {
        clearInterval(gameState.timer);
    }
    
    gameState.timeRemaining = 45;
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
    const timerElement = document.getElementById('timer');
    timerElement.textContent = `${gameState.timeRemaining}s`;
    
    // Change color based on remaining time
    if (gameState.timeRemaining <= 10) {
        timerElement.style.color = '#dc3545';
    } else if (gameState.timeRemaining <= 20) {
        timerElement.style.color = '#ffc107';
    } else {
        timerElement.style.color = '#ff6b35';
    }
}

function timeUp() {
    // Auto-submit with no answer selected
    const story = gameData.stories[gameState.currentStory];
    
    // Store answer as incorrect
    gameState.answers.push({
        storyId: story.id,
        storyTitle: story.title,
        selectedAnswer: -1, // No answer selected
        correctAnswer: story.correct,
        isCorrect: false,
        points: 0,
        responseTime: 45,
        hasSpeedBonus: false
    });
    
    // Show feedback for time up
    showFeedback(false, 0, story, false);
    
    // Update feedback content for time up scenario
    const feedbackContent = document.getElementById('feedback-content');
    feedbackContent.innerHTML = `
        <div class="feedback-header">
            <div class="feedback-icon">⏰</div>
            <h3 class="feedback-title">Time's Up!</h3>
        </div>
        <div class="feedback-points">No points earned</div>
        <div class="feedback-explanation">
            <strong>Correct Answer:</strong> ${story.options[story.correct]}
        </div>
        <div class="feedback-example">
            <strong>Example:</strong> ${story.example}
        </div>
    `;
    
    // Highlight correct answer
    const options = document.querySelectorAll('.option');
    options.forEach((option, index) => {
        if (index === story.correct) {
            option.classList.add('correct');
        }
    });
}

// Audio Functions (Placeholder - will be implemented when audio is added)
function playAudio() {
    // For now, simulate audio playback with text-to-speech
    const story = gameData.stories[gameState.currentStory];
    if (story && 'speechSynthesis' in window) {
        // Stop any current speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(story.audioText);
        utterance.rate = getAudioSpeed();
        utterance.volume = getAudioVolume();
        
        utterance.onstart = () => {
            gameState.isPlaying = true;
            updateAudioControls();
            startAudioTimer();
        };
        
        utterance.onend = () => {
            gameState.isPlaying = false;
            updateAudioControls();
            stopAudioTimer();
        };
        
        window.speechSynthesis.speak(utterance);
    }
}

function pauseAudio() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.pause();
        gameState.isPlaying = false;
        updateAudioControls();
        stopAudioTimer();
    }
}

function restartAudio() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        gameState.currentAudioTime = 0;
        updateAudioProgress();
        setTimeout(playAudio, 100); // Small delay to ensure cancel completes
    }
}

function updateAudioControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    
    if (gameState.isPlaying) {
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'flex';
    } else {
        playBtn.style.display = 'flex';
        pauseBtn.style.display = 'none';
    }
}

function startAudioTimer() {
    // Estimate audio duration (words per minute calculation)
    const story = gameData.stories[gameState.currentStory];
    const wordCount = story.audioText.split(' ').length;
    const estimatedDuration = (wordCount / 150) * 60; // Assuming 150 WPM
    
    gameState.totalAudioTime = estimatedDuration;
    gameState.currentAudioTime = 0;
    
    gameState.audioTimer = setInterval(() => {
        gameState.currentAudioTime += 0.1;
        updateAudioProgress();
        
        if (gameState.currentAudioTime >= gameState.totalAudioTime) {
            stopAudioTimer();
            gameState.isPlaying = false;
            updateAudioControls();
        }
    }, 100);
}

function stopAudioTimer() {
    if (gameState.audioTimer) {
        clearInterval(gameState.audioTimer);
        gameState.audioTimer = null;
    }
}

function updateAudioProgress() {
    const progressFill = document.getElementById('audio-progress-fill');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    
    const progress = gameState.totalAudioTime > 0 
        ? (gameState.currentAudioTime / gameState.totalAudioTime) * 100 
        : 0;
    
    progressFill.style.width = `${Math.min(progress, 100)}%`;
    
    currentTimeEl.textContent = formatTime(gameState.currentAudioTime);
    totalTimeEl.textContent = formatTime(gameState.totalAudioTime);
}

function resetAudioPlayer() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    
    gameState.isPlaying = false;
    gameState.currentAudioTime = 0;
    gameState.totalAudioTime = 0;
    
    updateAudioControls();
    updateAudioProgress();
    stopAudioTimer();
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getAudioSpeed() {
    const speedBtn = document.getElementById('speed-btn');
    const speedText = speedBtn.textContent;
    if (speedText.includes('0.75x')) return 0.75;
    if (speedText.includes('1.25x')) return 1.25;
    if (speedText.includes('1.5x')) return 1.5;
    return 1.0;
}

function getAudioVolume() {
    const volumeBtn = document.getElementById('volume-btn');
    return volumeBtn.textContent === '🔇' ? 0 : 1;
}

function changeSpeed() {
    const speedBtn = document.getElementById('speed-btn');
    const currentSpeed = getAudioSpeed();
    
    let newSpeed;
    if (currentSpeed === 0.75) newSpeed = 1.0;
    else if (currentSpeed === 1.0) newSpeed = 1.25;
    else if (currentSpeed === 1.25) newSpeed = 1.5;
    else newSpeed = 0.75;
    
    speedBtn.textContent = `Speed: ${newSpeed}x`;
    
    // If audio is playing, restart with new speed
    if (gameState.isPlaying) {
        restartAudio();
    }
}

function toggleVolume() {
    const volumeBtn = document.getElementById('volume-btn');
    if (volumeBtn.textContent === '🔊') {
        volumeBtn.textContent = '🔇';
    } else {
        volumeBtn.textContent = '🔊';
    }
    
    // If audio is playing, restart with new volume
    if (gameState.isPlaying) {
        restartAudio();
    }
}

function showTranscript() {
    const modal = document.getElementById('transcript-modal');
    modal.classList.add('active');
    
    // Focus trap for accessibility
    const closeBtn = modal.querySelector('.close-transcript');
    closeBtn.focus();
}

function closeTranscript() {
    const modal = document.getElementById('transcript-modal');
    modal.classList.remove('active');
    
    // Return focus to transcript button
    document.getElementById('transcript-btn').focus();
}

// Results and Completion
function showResults() {
    calculateFinalStats();
    displayPerformanceSummary();
    showScreen('complete');
}

function calculateFinalStats() {
    const totalQuestions = gameState.answers.length;
    const correctAnswers = gameState.answers.filter(answer => answer.isCorrect).length;
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Update final stats display
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('final-accuracy').textContent = `${accuracy}%`;
    document.getElementById('final-correct').textContent = `${correctAnswers}/${totalQuestions}`;
}

function displayPerformanceSummary() {
    const performanceList = document.getElementById('performance-list');
    performanceList.innerHTML = '';
    
    gameState.answers.forEach(answer => {
        const performanceItem = document.createElement('div');
        performanceItem.className = `performance-item ${answer.isCorrect ? 'correct' : 'incorrect'}`;
        
        const resultBadge = answer.isCorrect ? 
            '<span class="result-badge correct">Correct</span>' : 
            '<span class="result-badge incorrect">Incorrect</span>';
        
        const speedBonusText = answer.hasSpeedBonus ? ' (Speed Bonus!)' : '';
        
        performanceItem.innerHTML = `
            <div class="performance-details">
                <div class="performance-title">${answer.storyTitle}</div>
                <div class="performance-description">
                    ${answer.selectedAnswer === -1 ? 'No answer given (time up)' : 
                      gameData.stories.find(s => s.id === answer.storyId).options[answer.selectedAnswer]}
                </div>
            </div>
            <div class="performance-result">
                ${resultBadge}
                <span class="result-points">${answer.points}pts${speedBonusText}</span>
            </div>
        `;
        
        performanceList.appendChild(performanceItem);
    });
}

function playAgain() {
    // Reset game state
    gameState.currentStory = 0;
    gameState.score = 0;
    gameState.answers = [];
    gameState.timeRemaining = 45;
    
    // Clear any timers
    if (gameState.timer) clearInterval(gameState.timer);
    if (gameState.audioTimer) clearInterval(gameState.audioTimer);
    
    // Reset audio
    resetAudioPlayer();
    
    // Start new game
    startGame();
}

function goToDashboard() {
    window.location.href = 'games.html';
}

// Keyboard Navigation
function handleKeydown(event) {
    const activeScreen = document.querySelector('.screen.active');
    const activeScreenId = activeScreen ? activeScreen.id : '';
    
    switch(event.key) {
        case 'Enter':
        case ' ':
            // Handle enter/space on focused elements
            if (document.activeElement.tagName === 'BUTTON') {
                event.preventDefault();
                document.activeElement.click();
            } else if (document.activeElement.classList.contains('option')) {
                event.preventDefault();
                document.activeElement.click();
            }
            break;
            
        case 'Escape':
            // Close transcript modal
            if (document.getElementById('transcript-modal').classList.contains('active')) {
                closeTranscript();
            }
            break;
            
        case 'ArrowUp':
        case 'ArrowDown':
            // Navigate through options
            if (activeScreenId === 'game-screen') {
                event.preventDefault();
                navigateOptions(event.key === 'ArrowUp' ? -1 : 1);
            }
            break;
            
        case 'ArrowLeft':
        case 'ArrowRight':
            // Navigate tutorial steps
            if (activeScreenId === 'tutorial-screen') {
                event.preventDefault();
                if (event.key === 'ArrowRight') {
                    nextTutorial();
                } else {
                    prevTutorial();
                }
            }
            break;
            
        case '1':
        case '2':
        case '3':
        case '4':
            // Quick select options
            if (activeScreenId === 'game-screen') {
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
    const options = document.querySelectorAll('.option');
    const currentIndex = Array.from(options).findIndex(option => 
        option === document.activeElement || option.contains(document.activeElement)
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

// Accessibility Features
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Add screen reader only styles
const style = document.createElement('style');
style.textContent = `
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
`;
document.head.appendChild(style);

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGame);
} else {
    initializeGame();
}