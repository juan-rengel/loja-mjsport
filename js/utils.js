// /js/utils.js

// Formatação de moeda
export function formatCurrencyBRL(value) {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Coletar parâmetros da URL
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Criar link WhatsApp
export function buildWhatsAppUrl(phone, product) {
  const message = `
Olá! Tenho interesse neste produto:

• Produto: ${product.name}
• Categoria: ${product.categoryName || ""}
• Preço: ${formatCurrencyBRL(product.price)}
• Descrição: ${product.description || ""}

Poderia me informar disponibilidade?
  `.trim();

  return `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
}
