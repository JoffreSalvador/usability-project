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
