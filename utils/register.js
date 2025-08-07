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
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm-password');
const passwordMismatchError = document.getElementById('password-mismatch-error');
// NUEVO: Referencia al campo de email y a su mensaje de error específico
const emailInput = document.getElementById('email');
const emailErrorMessage = document.getElementById('email-error-message');


// Elementos para las directrices de la contraseña
const passwordGuidelines = document.getElementById('password-guidelines');
const guidelineLength = document.getElementById('guideline-length');
const guidelineUppercase = document.getElementById('guideline-uppercase');
const guidelineNumber = document.getElementById('guideline-number');
const guidelineSpecial = document.getElementById('guideline-special');

// NUEVO: Referencias a los iconos de toggle de la contraseña
const passwordToggleImg = document.getElementById("password-toggle-img-register");
const confirmPasswordToggleImg = document.getElementById("confirm-password-toggle-img-register");

// Función para alternar la visibilidad de la contraseña
const setupPasswordToggle = (inputElement, imgElement) => {
    imgElement.addEventListener("click", () => {
        const type = inputElement.getAttribute("type") === "password" ? "text" : "password";
        inputElement.setAttribute("type", type);
        
        if (type === "text") {
            imgElement.src = "../assets/img/eye-password-showing.svg";
        } else {
            imgElement.src = "../assets/img/eye-password-hiding.svg";
        }
    });
};

// Aplica la lógica del toggle a ambos campos de contraseña
setupPasswordToggle(passwordInput, passwordToggleImg);
setupPasswordToggle(confirmPasswordInput, confirmPasswordToggleImg);


// Lógica para la validación de la contraseña en tiempo real
passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*()]/.test(password)
    };

    if (password.length > 0) {
        passwordGuidelines.classList.add('active');
    } else {
        passwordGuidelines.classList.remove('active');
    }

    const updateGuideline = (element, isValid) => {
        element.classList.toggle('valid', isValid);
        element.classList.toggle('invalid', !isValid);
        element.querySelector('.check-icon').textContent = isValid ? '✓' : '✗';
    };

    updateGuideline(guidelineLength, requirements.length);
    updateGuideline(guidelineUppercase, requirements.uppercase);
    updateGuideline(guidelineNumber, requirements.number);
    updateGuideline(guidelineSpecial, requirements.special);
});

// Lógica para validar la coincidencia de contraseñas al escribir
confirmPasswordInput.addEventListener('input', () => {
    if (passwordInput.value !== confirmPasswordInput.value) {
        passwordMismatchError.textContent = 'The passwords do not match.';
        passwordMismatchError.style.display = 'block';
    } else {
        passwordMismatchError.textContent = '';
        passwordMismatchError.style.display = 'none';
    }
});

// NUEVO: Limpiar el mensaje de error del email al escribir
emailInput.addEventListener('input', () => {
    emailErrorMessage.textContent = '';
    emailErrorMessage.style.display = 'none';
});


registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Limpia los mensajes de error/éxito anteriores
    errorMessage.textContent = '';
    successMessage.textContent = '';
    passwordMismatchError.style.display = 'none';
    emailErrorMessage.style.display = 'none'; // NUEVO: Limpia el error del email al enviar el formulario


    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const email = emailInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Validación de contraseñas
    if (password !== confirmPassword) {
        passwordMismatchError.textContent = 'The passwords do not match.';
        passwordMismatchError.style.display = 'block';
        return;
    }

    const isPasswordSecure = password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*()]/.test(password);
    if (!isPasswordSecure) {
        errorMessage.textContent = 'The password does not meet all security requirements.';
        return;
    }

    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        const userData = {
            email: email,
            game1_score: 0,
            game2_score: 0,
            game3_score: 0,
            last_name: lastName,
            name: firstName,
        };
        
        await db.collection("user").doc(user.uid).set(userData);

        successMessage.textContent = 'Registration successful! Redirecting to Dashboard...';
        registerForm.reset();

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);

    } catch (error) {
        console.error("Error registering user: ", error);
        
        // NUEVO: Manejo específico para el error de email
        if (error.code === 'auth/email-already-in-use') {
            emailErrorMessage.textContent = 'The email address is already in use. Try signing in or using another email address.';
            emailErrorMessage.style.display = 'block';
        } else if (error.code === 'auth/weak-password') {
            // Este error ya no debería ocurrir si se usan las validaciones del front-end, pero se mantiene como respaldo
            errorMessage.textContent = 'The password is too weak. It must be at least 6 characters long.';
            errorMessage.style.display = 'block';
        } else if (error.code === 'auth/invalid-email') {
            emailErrorMessage.textContent = 'The email format is not valid.';
            emailErrorMessage.style.display = 'block';
        } else {
            errorMessage.textContent = 'An error occurred while registering. Please try again.';
            errorMessage.style.display = 'block';
        }
    }
});