import type { CartItem } from "../types";

const CART_KEY = "cart";

const cartTableBody = document.querySelector<HTMLTableSectionElement>("tbody");
const subtotalPriceElement = document.querySelector(
  ".subtotal-price"
) as HTMLElement;
const totalPriceElement = document.querySelector(".total-price") as HTMLElement;

function getCartFromStorage(): CartItem[] {
  const cartRaw = localStorage.getItem(CART_KEY);
  return cartRaw ? JSON.parse(cartRaw) : [];
}

function saveCartToStorage(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPrice(price: number): string {
  return `USD $${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;
}

function renderCartItems() {
  const cart = getCartFromStorage();

  if (!cartTableBody) return;

  cartTableBody.innerHTML = "";

  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="cart-items-added">
        <img src="${item.image}" alt="${item.title}" />
        <a href="/product.html?id=${item.id}">${item.title}</a>
      </td>
      <td>${formatPrice(item.price)}</td>
      <td>
        <input type="number" value="${
          item.quantity
        }" min="1" data-index="${index}" class="quantity-input" />
      </td>
      <td>${formatPrice(itemSubtotal)}</td>
      <td>
        <button class="delete-btn" data-index="${index}">
          <img src="./public/icons/cart-items-delete.svg" alt="Delete" class="cart-items-del-icon" />
        </button>
      </td>
    `;

    cartTableBody.appendChild(row);
  });

  subtotalPriceElement.textContent = formatPrice(subtotal);
  totalPriceElement.textContent = formatPrice(subtotal);
}

function setupEventListeners() {
  if (!cartTableBody) return;

  cartTableBody.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    if (target.closest(".delete-btn")) {
      const btn = target.closest(".delete-btn") as HTMLButtonElement;
      const index = Number(btn.dataset.index);
      const cart = getCartFromStorage();
      cart.splice(index, 1);
      saveCartToStorage(cart);
      renderCartItems();
    }
  });

  cartTableBody.addEventListener("change", (e) => {
    const input = e.target as HTMLInputElement;
    if (input.classList.contains("quantity-input")) {
      const index = Number(input.dataset.index);
      const newQuantity = Math.max(1, Number(input.value));
      const cart = getCartFromStorage();
      cart[index].quantity = newQuantity;
      saveCartToStorage(cart);
      renderCartItems();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderCartItems();
  setupEventListeners();
});
