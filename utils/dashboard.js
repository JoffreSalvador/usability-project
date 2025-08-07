// utils/dashboard.js

// Configuración de Firebase (debe ser la misma que usaste en register.js)
const firebaseConfig = {
    apiKey: "AIzaSyD0TwV4TTSSXKj38wQIgSXxuwPHES2UuQw",
    authDomain: "usability-project-a06cc.firebaseapp.com",
    projectId: "usability-project-a06cc",
    storageBucket: "usability-project-a06cc.firebasestorage.app",
    messagingSenderId: "850560628267",
    appId: "1:850560628267:web:37efed97f18bddd2421c6e"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa los servicios de autenticación y Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Obtener referencias a los elementos HTML
const signInBtn = document.getElementById('signInBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const userInfoDiv = document.getElementById('userInfo');
const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');

// Listener para cambios en el estado de autenticación
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Usuario logueado
        signInBtn.style.display = 'none'; // Ocultar botón de Sign In
        getStartedBtn.style.display = 'none'; // Ocultar botón de Get Started
        userInfoDiv.style.display = 'flex'; // Mostrar información del usuario

        try {
            // Buscar el documento del usuario en Firestore usando su UID
            const userDoc = await db.collection("user").doc(user.uid).get();

            if (userDoc.exists) {
                const userDataFromFirestore = userDoc.data();
                userNameSpan.textContent = userDataFromFirestore.name || user.email; // Mostrar el nombre o el email
            } else {
                // Si el documento no existe (ej. usuario creado antes de este cambio),
                // puedes intentar buscar por email como fallback o solo mostrar el email
                console.warn("Documento de usuario no encontrado en Firestore para UID:", user.uid);
                userNameSpan.textContent = user.email;
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario de Firestore:", error);
            userNameSpan.textContent = user.email; // En caso de error, mostrar el email
        }

    } else {
        // No hay usuario logueado
        signInBtn.style.display = 'block'; // Mostrar botón de Sign In
        getStartedBtn.style.display = 'block'; // Mostrar botón de Get Started
        userInfoDiv.style.display = 'none'; // Ocultar información del usuario
    }
});

// Función para cerrar sesión
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        // Redirigir a la página de inicio de sesión después de cerrar sesión
        window.location.href = 'login.html'; 
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
    }
});

document.addEventListener('DOMContentLoaded', function () {
    auth.onAuthStateChanged(async (user) => {
        let userData = {
            game1_score: 0,
            game2_score: 0,
            game3_score: 0,
            name: "User"
        };

        if (user) {
            // Obtén el documento Firestore
            try {
                const userDoc = await db.collection("user").doc(user.uid).get();
                if (userDoc.exists) {
                    const data = userDoc.data();
                    userData.name = data.name || user.email;
                    if (typeof data.game1_score === 'number') userData.game1_score = data.game1_score;
                    if (typeof data.game2_score === 'number') userData.game2_score = data.game2_score;
                    if (typeof data.game3_score === 'number') userData.game3_score = data.game3_score;
                }
            } catch (error) {
                console.error("Error al cargar datos Firestore:", error);
            }

            // También sobrescribe con localStorage si existe (útil tras jugar)
            const storedVideoGameScore = localStorage.getItem("game3_score");
            if (storedVideoGameScore !== null) {
                userData.game3_score = parseInt(storedVideoGameScore, 10);
            }
        } else {
            // Si no hay usuario, usa localStorage o default
            const storedVideoGameScore = localStorage.getItem("game3_score");
            if (storedVideoGameScore !== null) {
                userData.game3_score = parseInt(storedVideoGameScore, 10);
            }
        }

        // Saludo
        if (document.getElementById('welcome-title')) {
            document.getElementById('welcome-title').innerText = `Welcome back, ${userData.name}! 👋`;
        }

        // Calcula y muestra totalScore
        const totalScore = (userData.game1_score || 0) + (userData.game2_score || 0) + (userData.game3_score || 0);
        if (document.getElementById('score-total')) {
            document.getElementById('score-total').innerText = totalScore;
        }

        // Progreso por juegos
        const games = [
            { name: "Listening Game", score: userData.game1_score, max: 10 },
            { name: "Reading Game", score: userData.game2_score, max: 10 },
            { name: "Video Game", score: userData.game3_score, max: 10 }
        ];

        if (document.getElementById('progress-list')) {
            document.getElementById('progress-list').innerHTML = games.map(g => {
                const percent = Math.round((g.score / g.max) * 100);
                return `
                  <div class="progress-item">
                    <div style="display:flex; justify-content:space-between;">
                      <span>${g.name}</span>
                      <span>${percent}%</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width:${percent}%;"></div>
                    </div>
                  </div>
                `;
            }).join('');
        }

        // Achievements
        let achievements = [];
        if (games.some(g => g.score > 0)) achievements.push("🏅 First game played");
        if (games.some(g => g.score === 10)) achievements.push("🎯 Perfect score in a game");
        if (games.every(g => g.score > 0)) achievements.push("🏆 All games completed");
        if (totalScore >= 25) achievements.push("⭐ Over 25 total points");

        if (document.getElementById('achievements-list')) {
            document.getElementById('achievements-list').innerHTML =
                achievements.length
                    ? achievements.map(a => `<li>${a}</li>`).join('')
                    : `<li>No achievements yet. Keep playing!</li>`;
        }
    });
});


