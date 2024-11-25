// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration (replace with your config)
const firebaseConfig = {
    apiKey: "AIzaSyCbB1Y_cWOIBa9gThcmm7nroQV6XomFuEU",
    authDomain: "projectsyabri.firebaseapp.com",
    projectId: "projectsyabri",
    storageBucket: "projectsyabri.appspot.com",
    messagingSenderId: "1013347367098",
    appId: "1:1013347367098:web:362ac0b98802861ca72a83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const reactionsContainer = document.getElementById("reactions-container");
const responsesList = document.getElementById("responses");

// Function to handle login
loginBtn.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            alert(`Selamat datang, ${user.displayName}`);
            loginBtn.style.display = "none";
            logoutBtn.style.display = "block";
            reactionsContainer.style.display = "flex";
        })
        .catch((error) => {
            console.error("Login gagal:", error);
        });
});

// Function to handle logout
logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            alert("Anda telah logout.");
            loginBtn.style.display = "block";
            logoutBtn.style.display = "none";
            reactionsContainer.style.display = "none";
        })
        .catch((error) => {
            console.error("Logout gagal:", error);
        });
});

// Function to submit reaction
function submitReaction(reaction) {
    const user = auth.currentUser;
    if (!user) {
        alert("Anda harus login untuk memberikan reaksi.");
        return;
    }

    const reactionsCollection = collection(db, "reactions");
    addDoc(reactionsCollection, {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        reaction: reaction,
        timestamp: new Date()
    })
        .then(() => {
            alert("Reaksi Anda telah disimpan!");
        })
        .catch((error) => {
            console.error("Gagal menyimpan reaksi:", error);
        });
}

// Real-time updates to response list
const reactionsQuery = query(collection(db, "reactions"), orderBy("timestamp", "desc"));
onSnapshot(reactionsQuery, (snapshot) => {
    responsesList.innerHTML = ""; // Clear list
    snapshot.forEach((doc) => {
        const data = doc.data();
        const listItem = document.createElement("li");
        listItem.textContent = `${data.userName} (${data.userEmail}): ${data.reaction} (${new Date(data.timestamp.seconds * 1000).toLocaleString()})`;
        responsesList.appendChild(listItem);
    });
});
