// utils/auth-ui.js
// Configuración de Firebase (debe ser la misma en todos tus scripts de Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyD0TwV4TTSSXKj38wQIgSXxuwPHES2UuQw",
    authDomain: "usability-project-a06cc.firebaseapp.com",
    projectId: "usability-project-a06cc",
    storageBucket: "usability-project-a06cc.firebasestorage.app",
    messagingSenderId: "850560628267",
    appId: "1:850560628267:web:37efed97f18bddd2421c6e"
};

// Inicializa Firebase si aún no ha sido inicializado
// Esto previene errores si ya se inicializó en otro script (ej. register.js)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Inicializa los servicios de autenticación y Firestore
const auth = firebase.auth();
const db = firebase.firestore();

// Obtener referencias a los elementos HTML
const signInBtn = document.getElementById('signInBtn');
const getStartedBtn = document.getElementById('getStartedBtn');
const userInfoDiv = document.getElementById('userInfo');
const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const authArea = document.getElementById('authArea'); // Obtener referencia al contenedor principal

// Listener para cambios en el estado de autenticación
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Usuario logueado
        if (signInBtn) signInBtn.style.display = 'none';
        if (getStartedBtn) getStartedBtn.style.display = 'none';
        if (userInfoDiv) userInfoDiv.style.display = 'flex';

        try {
            // Buscar el documento del usuario en Firestore usando su UID
            const userDoc = await db.collection("user").doc(user.uid).get();

            if (userDoc.exists) {
                const userDataFromFirestore = userDoc.data();
                if (userNameSpan) userNameSpan.textContent = userDataFromFirestore.name || user.email;
            } else {
                console.warn("Documento de usuario no encontrado en Firestore para UID:", user.uid);
                if (userNameSpan) userNameSpan.textContent = user.email;
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario de Firestore:", error);
            if (userNameSpan) userNameSpan.textContent = user.email;
        }

    } else {
        // No hay usuario logueado
        if (signInBtn) signInBtn.style.display = 'block';
        if (getStartedBtn) getStartedBtn.style.display = 'block';
        if (userInfoDiv) userInfoDiv.style.display = 'none';
    }

    // Una vez que el estado de autenticación se ha determinado y la UI se ha actualizado,
    // haz que el contenedor principal de autenticación sea visible.
    if (authArea) {
        authArea.style.opacity = '1';
    }
});

// Función para cerrar sesión
if (logoutBtn) { // Asegurarse de que el botón existe antes de añadir el listener
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
            // Redirigir a la página de inicio de sesión después de cerrar sesión
            window.location.href = 'login.html'; 
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    });
}