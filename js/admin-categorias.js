// /js/admin-categorias.js
import {
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "./firebase-config.js";

import { requireAuth, attachLogout } from "./auth.js";

requireAuth();
attachLogout("logout-btn");

const form = document.getElementById("category-form");
const idInput = document.getElementById("category-id");
const nameInput = document.getElementById("category-name");
const msg = document.getElementById("category-msg");
const tableBody = document.getElementById("categories-table-body");

async function loadCategories() {
  const snap = await getDocs(collection(db, "categories"));
  tableBody.innerHTML = "";

  snap.forEach((d) => {
    const cat = { id: d.id, ...d.data() };

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${cat.name}</td>
      <td>
        <button class="btn-edit" data-id="${cat.id}">Editar</button>
        <button class="btn-delete" data-id="${cat.id}">Excluir</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => fillForm(btn.dataset.id));
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteCategory(btn.dataset.id));
  });
}

async function fillForm(id) {
  const snap = await getDocs(collection(db, "categories"));
  const found = snap.docs.find((d) => d.id === id);
  if (!found) return;

  const cat = found.data();

  idInput.value = found.id;
  nameInput.value = cat.name;

  msg.textContent = "Editando categoria...";
}

async function deleteCategory(id) {
  if (!confirm("Deseja excluir esta categoria?")) return;

  await deleteDoc(doc(db, "categories", id));
  await loadCategories();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const id = idInput.value;
  const name = nameInput.value.trim();

  if (!name) return;

  try {
    if (id) {
      await updateDoc(doc(db, "categories", id), { name });
      msg.textContent = "Categoria atualizada.";
    } else {
      await addDoc(collection(db, "categories"), { name });
      msg.textContent = "Categoria criada.";
    }

    form.reset();
    idInput.value = "";
    await loadCategories();
  } catch {
    msg.textContent = "Erro ao salvar.";
  }
});

loadCategories();
