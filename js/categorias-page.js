// /js/categorias-page.js
import {
  db,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
} from "./firebase-config.js";
import { formatCurrencyBRL, getQueryParam } from "./utils.js";

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const categoriesList = document.getElementById("categories-list");
const productsGrid = document.getElementById("products-grid");
const categoryTitle = document.getElementById("category-title");

async function loadCategories() {
  const snap = await getDocs(collection(db, "categories"));
  categoriesList.innerHTML = "";

  snap.forEach((d) => {
    const cat = { id: d.id, ...d.data() };

    const a = document.createElement("a");
    a.className = "category-card";
    a.href = `categorias.html?id=${cat.id}`;
    a.textContent = cat.name;

    categoriesList.appendChild(a);
  });
}

async function loadProductsByCategory() {
  const catId = getQueryParam("id");
  productsGrid.innerHTML = "";

  if (!catId) {
    categoryTitle.textContent = "Selecione uma categoria para ver os produtos";
    return;
  }

  // Nome da categoria
  const catRef = doc(db, "categories", catId);
  const catSnap = await getDoc(catRef);

  if (catSnap.exists()) {
    categoryTitle.textContent = `Produtos da categoria: ${catSnap.data().name}`;
  } else {
    categoryTitle.textContent = "Categoria não encontrada";
  }

  const q = query(collection(db, "products"), where("categoryId", "==", catId));
  const snap = await getDocs(q);

  if (snap.empty) {
    productsGrid.innerHTML = "<p>Nenhum produto nesta categoria.</p>";
    return;
  }

  snap.forEach((d) => {
    const p = { id: d.id, ...d.data() };

    if (!p.isActive) return;

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.imageUrl || "./assets/img/placeholder.png"}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p class="price">${formatCurrencyBRL(p.price)}</p>
      <button class="btn-details">Ver detalhes</button>
    `;

    card.querySelector(".btn-details").addEventListener("click", () => {
      window.location.href = `produto.html?id=${p.id}`;
    });

    productsGrid.appendChild(card);
  });
}

(async function init() {
  await loadCategories();
  await loadProductsByCategory();
})();
