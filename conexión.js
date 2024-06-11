// aqui va todo lo que tiene que ver con la configuración de la base de datos, se mantiene vacía por seguridad a las credenciales originales
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = app.firestore();

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('btnExtraer').addEventListener('click', extraerDatos);
});
