// /js/admin-produtos.js
import {
  db,
  storage,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  ref,
  uploadBytes,
  getDownloadURL,
} from "./firebase-config.js";

import { formatCurrencyBRL } from "./utils.js";
import { requireAuth, attachLogout } from "./auth.js";

requireAuth();
attachLogout("logout-btn");

// Form inputs
const form = document.getElementById("product-form");
const idInput = document.getElementById("product-id");
const nameInput = document.getElementById("product-name");
const descInput = document.getElementById("product-description");
const priceInput = document.getElementById("product-price");
const categorySelect = document.getElementById("product-category");
const imageInput = document.getElementById("product-image");
const activeInput = document.getElementById("product-active");
const featuredInput = document.getElementById("product-featured");
const msg = document.getElementById("product-msg");
const tableBody = document.getElementById("products-table-body");

let categories = [];
let products = [];

// PUXAR CATEGORIAS
async function loadCategories() {
  const snap = await getDocs(collection(db, "categories"));
  categories = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  categorySelect.innerHTML = "";

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    categorySelect.appendChild(opt);
  });
}

function getCategoryName(id) {
  const c = categories.find((x) => x.id === id);
  return c ? c.name : "";
}

// PUXAR PRODUTOS
async function loadProducts() {
  const snap = await getDocs(collection(db, "products"));
  products = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  tableBody.innerHTML = "";

  products.forEach((p) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${p.name}</td>
      <td>${p.categoryName || ""}</td>
      <td>${formatCurrencyBRL(p.price)}</td>
      <td>${p.isActive ? "Sim" : "Não"}</td>
      <td>${p.isFeatured ? "Sim" : "Não"}</td>
      <td>
        <button class="btn-edit" data-id="${p.id}">Editar</button>
        <button class="btn-delete" data-id="${p.id}">Excluir</button>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", () => fillForm(btn.dataset.id));
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => deleteProduct(btn.dataset.id));
  });
}

// UPLOAD DA IMAGEM
async function uploadImage(productId) {
  const file = imageInput.files[0];
  if (!file) return null;

  const fileRef = ref(storage, `products/${productId}-${file.name}`);
  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);
  return url;
}

// SALVAR PRODUTO
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.textContent = "";

  const id = idInput.value;
  const name = nameInput.value.trim();
  const description = descInput.value.trim();
  const price = parseFloat(priceInput.value);
  const categoryId = categorySelect.value;
  const categoryName = getCategoryName(categoryId);
  const isActive = activeInput.checked;
  const isFeatured = featuredInput.checked;

  try {
    if (!id) {
      // Criar novo produto
      const refDoc = await addDoc(collection(db, "products"), {
        name,
        description,
        price,
        categoryId,
        categoryName,
        isActive,
        isFeatured,
        imageUrl: "",
        createdAt: new Date(),
      });

      const url = await uploadImage(refDoc.id);
      if (url) await updateDoc(refDoc, { imageUrl: url });

      msg.textContent = "Produto criado.";
    } else {
      // Atualizar produto
      const refDoc = doc(db, "products", id);

      await updateDoc(refDoc, {
        name,
        description,
        price,
        categoryId,
        categoryName,
        isActive,
        isFeatured,
      });

      const url = await uploadImage(id);
      if (url) await updateDoc(refDoc, { imageUrl: url });

      msg.textContent = "Produto atualizado.";
    }

    form.reset();
    idInput.value = "";
    activeInput.checked = true;
    featuredInput.checked = false;

    await loadProducts();

  } catch (err) {
    console.error(err);
    msg.textContent = "Erro ao salvar produto.";
  }
});

// EDITAR PRODUTO
async function fillForm(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  idInput.value = p.id;
  nameInput.value = p.name;
  descInput.value = p.description || "";
  priceInput.value = p.price;
  categorySelect.value = p.categoryId;
  activeInput.checked = p.isActive;
  featuredInput.checked = p.isFeatured;

  msg.textContent = "Editando produto...";
}

// EXCLUIR PRODUTO
async function deleteProduct(id) {
  if (!confirm("Deseja excluir este produto?")) return;
  await deleteDoc(doc(db, "products", id));
  await loadProducts();
}

// INICIALIZAÇÃO
(async () => {
  await loadCategories();
  await loadProducts();
})();
