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
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');
const emailErrorMessage = document.getElementById('email-error-message');
const passwordErrorMessage = document.getElementById('password-error-message');

// Función para limpiar todos los mensajes de error
const clearErrorMessages = () => {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
    emailErrorMessage.textContent = '';
    emailErrorMessage.style.display = 'none';
    passwordErrorMessage.textContent = '';
    passwordErrorMessage.style.display = 'none';
};

// Listener para limpiar los errores específicos al escribir
emailInput.addEventListener('input', clearErrorMessages);
passwordInput.addEventListener('input', clearErrorMessages);

// Listener para el envío del formulario de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    // Limpiar mensajes anteriores
    clearErrorMessages();

    // Obtener los valores del formulario
    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        // Intentar iniciar sesión con correo y contraseña
        await auth.signInWithEmailAndPassword(email, password);

        // Si el inicio de sesión es exitoso
        successMessage.textContent = 'Login successful! Redirecting...';
        successMessage.style.display = 'block';
        loginForm.reset(); // Limpiar el formulario

        // Redirigir al dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        // Si hay un error al iniciar sesión
        console.error("Error al iniciar sesión:", error);

        // Mensajes de error específicos de Firebase
        if (error.code === 'auth/user-not-found') {
            emailErrorMessage.textContent = 'This email is not registered.';
            emailErrorMessage.style.display = 'block';
        } else if (error.code === 'auth/wrong-password' || (error.code === 'auth/internal-error' && error.message.includes('INVALID_LOGIN_CREDENTIALS'))) {
            passwordErrorMessage.textContent = 'Invalid credentials. Please check your email and password.';
            passwordErrorMessage.style.display = 'block';
        } else if (error.code === 'auth/invalid-email') {
            emailErrorMessage.textContent = 'Invalid email format.';
            emailErrorMessage.style.display = 'block';
        } else if (error.code === 'auth/user-disabled') {
            errorMessage.textContent = 'Your account has been disabled.';
            errorMessage.style.display = 'block';
        } else {
            errorMessage.textContent = 'An error occurred during login. Please try again.';
            errorMessage.style.display = 'block';
        }
    }
});