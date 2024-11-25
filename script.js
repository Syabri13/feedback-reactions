import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCbB1Y_cWOIBa9gThcmm7nroQV6XomFuEU",
    authDomain: "projectsyabri.firebaseapp.com",
    projectId: "projectsyabri",
    storageBucket: "projectsyabri.firebasestorage.app",
    messagingSenderId: "1013347367098",
    appId: "1:1013347367098:web:362ac0b98802861ca72a83",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fungsi login dengan Google
document.getElementById("login-btn").addEventListener("click", function () {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then(() => {
            document.getElementById("auth-container").style.display = "none";
            document.getElementById("reactions-container").style.display = "block";
        })
        .catch((error) => {
            console.error("Login gagal:", error);
            document.getElementById("error-message").style.display = "block";
        });
});

// Fungsi logout
document.getElementById("logout-btn").addEventListener("click", function () {
    signOut(auth).then(() => {
        document.getElementById("auth-container").style.display = "block";
        document.getElementById("reactions-container").style.display = "none";
    });
});

// Fungsi pengiriman reaksi
function submitReaction(reaction) {
    console.log("Reaksi diklik:", reaction);
    const reactionsCollection = collection(db, "reactions");
    addDoc(reactionsCollection, {
        reaction: reaction,
        timestamp: new Date(),
    }).then(() => {
        console.log("Reaksi berhasil disimpan:", reaction);
    });
}

// Fungsi untuk menampilkan reaksi secara real-time
function displayReactions() {
    const reactionsCollection = collection(db, "reactions");
    const q = query(reactionsCollection);

    onSnapshot(q, (snapshot) => {
        const counts = {
            "Senang 😊": 0,
            "Sedih 😢": 0,
            "Marah 😡": 0,
            "Puas 👍": 0,
            "Tidak Puas 👎": 0,
        };

        snapshot.forEach((doc) => {
            const data = doc.data();
            counts[data.reaction] = (counts[data.reaction] || 0) + 1;
        });

        // Update tampilan jumlah reaksi
        const countsContainer = document.getElementById("counts");
        countsContainer.innerHTML = Object.entries(counts)
            .map(([reaction, count]) => `<p>${reaction}: ${count}</p>`)
            .join("");

        // Tampilkan daftar reaksi
        const responseList = document.getElementById("responses");
        responseList.innerHTML = ""; // Bersihkan daftar sebelumnya
        snapshot.forEach((doc) => {
            const data = doc.data();
            const li = document.createElement("li");
            li.textContent = `${data.reaction} (Waktu: ${data.timestamp.toDate().toLocaleString()})`;
            responseList.appendChild(li);
        });
    });
}

// Panggil fungsi untuk menampilkan reaksi
displayReactions();

// Fungsi untuk membersihkan daftar reaksi
function clearReactions() {
    document.getElementById("responses").innerHTML = "";
}
