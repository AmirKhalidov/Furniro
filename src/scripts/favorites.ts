import type { Product } from "../types";

const tbody = document.querySelector(
  ".fav-items tbody"
) as HTMLTableSectionElement;

function getFavorites(): Product[] {
  const raw = localStorage.getItem("favorites");
  return raw ? JSON.parse(raw) : [];
}

function saveFavorites(favorites: Product[]): void {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function removeFromFavorites(productId: number) {
  let favorites = getFavorites();
  favorites = favorites.filter((p) => p.id !== productId);
  saveFavorites(favorites);
  renderFavorites();
}

function renderFavorites() {
  const favorites = getFavorites();

  tbody.innerHTML = favorites
    .map(
      (product) => `
      <tr>
        <td class="fav-items-added">
          <img src="${product.images[0]}" alt="${product.title}" />
          <a href="/product.html?id=${product.id}">${product.title}</a>
        </td>
        <td>USD $${product.price}</td>
        <td>
          <button data-id="${product.id}" class="remove-btn">
            <img
              class="fav-items-del-icon"
              src="./public/icons/cart-items-delete.svg"
              alt="delete"
            />
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

tbody.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  const btn = target.closest(".remove-btn") as HTMLButtonElement;
  if (!btn) return;

  const id = +btn.dataset.id!;
  removeFromFavorites(id);
});

document.addEventListener("DOMContentLoaded", renderFavorites);
