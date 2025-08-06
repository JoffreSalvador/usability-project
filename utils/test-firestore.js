// utils/test-firestore.js

import { db } from './firebase-config.js'; // Asegúrate de importar tu configuración de Firebase
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js"; // Importar Firestore

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Agregar un documento de prueba a la colección 'test-users'
        const docRef = await addDoc(collection(db, "test-users"), {
            name: "Test User",
            email: "testuser@example.com",
            score: 100
        });

        console.log("Documento agregado con ID: ", docRef.id); // Confirmar que el documento fue agregado
    } catch (error) {
        console.error("Error agregando documento: ", error);
    }
});
