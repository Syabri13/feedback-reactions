// Inisialisasi Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbB1Y_cWOIBa9gThcmm7nroQV6XomFuEU", 
  authDomain: "projectsyabri.firebaseapp.com",
  projectId: "projectsyabri",
  storageBucket: "projectsyabri.firebasestorage.app",
  messagingSenderId: "1013347367098",
  appId: "1:1013347367098:web:362ac0b98802861ca72a83"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Fungsi login dengan Google
document.getElementById('login-btn').addEventListener('click', function () {
  const provider = new GoogleAuthProvider();
  
  signInWithPopup(auth, provider)
    .then((result) => {
      // Menyembunyikan tombol login dan menampilkan tombol logout
      document.getElementById('auth-container').style.display = 'none';
      document.getElementById('reactions-container').style.display = 'block';
      document.getElementById('logout-btn').style.display = 'inline-block';
      document.getElementById('login-btn').style.display = 'none';
      document.getElementById('clear-btn').style.display = 'inline-block';

      // Menampilkan nama pengguna yang login
      const user = result.user;
      console.log(user.displayName + " logged in");
    })
    .catch((error) => {
      console.log(error.message);
      document.getElementById('error-message').style.display = 'block';
    });
});

// Fungsi logout
document.getElementById('logout-btn').addEventListener('click', function () {
  signOut(auth).then(() => {
    // Menampilkan tombol login setelah logout
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('reactions-container').style.display = 'none';
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('login-btn').style.display = 'inline-block';
    document.getElementById('clear-btn').style.display = 'none';
  });
});

// Menangani pengiriman reaksi
function submitReaction(reaction) {
  const responseList = document.getElementById('responses');
  const li = document.createElement('li');
  li.textContent = reaction;
  responseList.appendChild(li);
}

// Menghapus reaksi
function clearReactions() {
  document.getElementById('responses').innerHTML = '';
}
