// utils/login.js

// Configuración de Firebase (debe ser la misma que usaste en register.js y auth-ui.js)
const firebaseConfig = {
    apiKey: "AIzaSyD0TwV4TTSSXKj38wQIgSXxuwPHES2UuQw",
    authDomain: "usability-project-a06cc.firebaseapp.com",
    projectId: "usability-project-a06cc",
    storageBucket: "usability-project-a06cc.firebasestorage.app",
    messagingSenderId: "850560628267",
    appId: "1:850560628267:web:37efed97f18bddd2421c6e"
};

// Inicializa Firebase si aún no ha sido inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Inicializa el servicio de autenticación
const auth = firebase.auth();

// Obtener referencias a los elementos HTML
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Listener para el envío del formulario de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    // Limpiar mensajes anteriores
    errorMessage.textContent = '';
    successMessage.textContent = '';

    // Obtener los valores del formulario
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Intentar iniciar sesión con correo y contraseña
        await auth.signInWithEmailAndPassword(email, password);

        // Si el inicio de sesión es exitoso
        successMessage.textContent = '¡Inicio de sesión exitoso! Redirigiendo...';
        loginForm.reset(); // Limpiar el formulario

        // Redirigir al dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        // Si hay un error al iniciar sesión
        console.error("Error al iniciar sesión:", error);
        let msg = 'Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.';

        // Mensajes de error específicos de Firebase
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            msg = 'Correo electrónico o contraseña incorrectos.';
        } else if (error.code === 'auth/invalid-email') {
            msg = 'El formato del correo electrónico no es válido.';
        } else if (error.code === 'auth/user-disabled') {
            msg = 'Tu cuenta ha sido deshabilitada.';
        }
        errorMessage.textContent = msg;
    }
});