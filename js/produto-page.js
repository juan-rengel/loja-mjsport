// /js/produto-page.js
import { db, doc, getDoc } from "./firebase-config.js";
import { formatCurrencyBRL, getQueryParam, buildWhatsAppUrl } from "./utils.js";

// Ano no rodapé
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Elementos da página
const container = document.getElementById("product-container");
const productId = getQueryParam("id");

// Número oficial da loja para WhatsApp
const WHATSAPP_PHONE = "5592993135510";

async function loadProduct() {
  if (!productId) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  const ref = doc(db, "products", productId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    container.innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  const p = { id: snap.id, ...snap.data() };

  container.innerHTML = `
    <div class="product-detail">
      <div class="product-detail-image">
        <img src="${p.imageUrl || "./assets/img/placeholder.png"}" alt="${p.name}">
      </div>

      <div class="product-detail-info">
        <h1>${p.name}</h1>
        <p class="category">${p.categoryName || ""}</p>
        <p class="price">${formatCurrencyBRL(p.price)}</p>
        <p class="description">${p.description || ""}</p>

        <button id="whatsapp-btn" class="btn-primary">Solicitar via WhatsApp</button>
      </div>
    </div>
  `;

  const btn = document.getElementById("whatsapp-btn");

  btn.addEventListener("click", () => {
    const url = buildWhatsAppUrl(WHATSAPP_PHONE, p);
    window.open(url, "_blank");
  });
}

loadProduct();
