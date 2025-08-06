// utils/register.js

// Configuración de Firebase
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

const registerForm = document.getElementById('register-form');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorMessage.textContent = '';
    successMessage.textContent = '';

    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Las contraseñas no coinciden. Por favor, inténtalo de nuevo.';
        return;
    }

    try {
        // 1. Crear el usuario en Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user; // Obtener el objeto de usuario autenticado

        // 2. Guardar los datos adicionales del usuario en Firestore
        // Usamos el UID de Firebase Auth como ID del documento en Firestore para una mejor vinculación
        const userData = {
            email: email,
            game1_score: 0,
            game2_score: 0,
            game3_score: 0,
            last_name: lastName,
            name: firstName,
            // NOTA: No es necesario guardar la contraseña en Firestore si usas Firebase Auth
        };
        
        await db.collection("user").doc(user.uid).set(userData); // Usamos .doc(user.uid).set()

        successMessage.textContent = '¡Registro exitoso! Redirigiendo...';
        registerForm.reset();

        // Redirigir a la página del dashboard
        window.location.href = 'dashboard.html';

    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        let msg = 'Ocurrió un error al registrar. Por favor, inténtalo de nuevo.';
        if (error.code === 'auth/email-already-in-use') {
            msg = 'El correo electrónico ya está en uso. Intenta iniciar sesión o usa otro correo.';
        } else if (error.code === 'auth/weak-password') {
            msg = 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.';
        }
        errorMessage.textContent = msg;
    }
});
