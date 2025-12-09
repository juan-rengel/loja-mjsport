// /js/auth.js
import { auth, onAuthStateChanged, signOut } from "./firebase-config.js";

// Bloqueia acesso se não estiver logado
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "./admin-login.html";
    }
  });
}

// Botão de logout
export function attachLogout(id) {
  const btn = document.getElementById(id);
  if (!btn) return;

  btn.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "./admin-login.html";
  });
}
