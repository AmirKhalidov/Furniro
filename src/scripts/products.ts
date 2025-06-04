import type { Product, ProductsResponse, CartItem } from "../types";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const productListElement = document.querySelector(
  ".products__list"
) as HTMLUListElement;
const itemsPerPageSelect = document.getElementById(
  "items-per-page"
) as HTMLSelectElement;
const sortBySelect = document.getElementById("sort-by") as HTMLSelectElement;
const categorySelect = document.getElementById("category") as HTMLSelectElement;
const infoText = document.querySelector(
  ".filter-bar__info span"
) as HTMLSpanElement;
const pageButtonsContainer = document.querySelector(
  ".products__page-btns"
) as HTMLDivElement;

let products: Product[] = [];
let currentPage = 1;
let itemsPerPage = +itemsPerPageSelect.value;
let totalProducts = 0;
let totalPages = 1;

async function fetchProducts(): Promise<void> {
  const res = await fetch("https://dummyjson.com/products?limit=100");
  const data: ProductsResponse = await res.json();
  products = data.products;
  totalProducts = data.total;
  totalPages = Math.ceil(products.length / itemsPerPage);
  populateCategoryOptions(products);
  renderPaginationButtons();
  renderProducts();
}

function populateCategoryOptions(products: Product[]) {
  const categories = Array.from(new Set(products.map((p) => p.category)));
  categorySelect.innerHTML =
    `<option value="all">All categories</option>` +
    categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
}

function renderProducts(): void {
  const filtered = filterProducts(products);
  const sorted = sortProducts(filtered);
  const paginated = paginate(sorted, currentPage, itemsPerPage);

  productListElement.innerHTML = paginated
    .map((product: Product) => createProductCard(product))
    .join("");

  infoText.textContent = `Showing ${paginated.length} of ${filtered.length} products`;
  totalPages = Math.ceil(filtered.length / itemsPerPage);
}

function createProductCard(product: Product): string {
  return `
    <li class="products-card" data-product-id="${product.id}">
      <img src="${product.images[0]}" alt="${
    product.title
  }" class="products-card--img"/>
      <div class="card-overlay">
        <button class="add-to-cart-btn" data-product-id="${
          product.id
        }">Add to cart</button>
        <div class="card-actions">
          <button class="card-action-btn">
            <img src="./public/icons/gridicons_share.svg" alt="share" />
            <span> Share </span>
          </button>
          <button class="card-action-btn">
            <img src="./public/icons/compare-svgrepo-com 1.svg" alt="compare" />
            <span> Compare </span>
          </button>
          <button class="card-action-btn">
            <img src="./public/icons/Heart.svg" alt="heart" />
            <span> Like </span>
          </button>
        </div>
      </div>
      <div class="products-card-text">
        <h5 class="products-card--title">${product.title
          .split(" ")
          .slice(0, 2)
          .join(" ")}</h5>
        <p class="products-card--desc">${product.description
          .split(" ")
          .slice(0, 3)
          .join(" ")}</p>
        <p class="products-card--price">USD $${product.price}</p>
      </div>
    </li>
  `;
}

function getCart(): CartItem[] {
  const cartRaw = localStorage.getItem("cart");
  return cartRaw ? JSON.parse(cartRaw) : [];
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product: Product) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
  }

  saveCart(cart);

  iziToast.success({
    title: "Added to Cart",
    message: `"${product.title}" has been added!`,
    position: "bottomRight",
    timeout: 2500,
    progressBar: true,
  });
}

productListElement.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;

  if (target.classList.contains("add-to-cart-btn")) {
    const productIdStr = target.getAttribute("data-product-id");
    if (!productIdStr) return;

    const productId = parseInt(productIdStr, 10);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    addToCart(product);
    return;
  }

  if (target.closest(".add-to-cart-btn")) {
    return;
  }

  const likeButton = target.closest(".card-action-btn");
  if (likeButton && likeButton.textContent?.trim() === "Like") {
    const card = likeButton.closest(".products-card") as HTMLElement;
    const productIdStr = card?.dataset.productId;
    if (!productIdStr) return;

    const productId = parseInt(productIdStr, 10);
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    addToFavorites(product);
    return;
  }

  const card = target.closest(".products-card") as HTMLElement | null;
  if (!card) return;

  const productId = card.dataset.productId;
  if (!productId) return;

  window.location.href = `/product.html?id=${productId}`;
});

function renderPaginationButtons() {
  pageButtonsContainer.innerHTML = "";

  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Prev";
  prevBtn.disabled = currentPage === 1;
  prevBtn.classList.add("products__page-btn");
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts();
      renderPaginationButtons();
    }
  });
  pageButtonsContainer.appendChild(prevBtn);

  const maxButtonsToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
  let endPage = startPage + maxButtonsToShow - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtonsToShow + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = String(i);
    btn.classList.add("products__page-btn");
    if (i === currentPage) {
      btn.disabled = true;
      btn.style.fontWeight = "700";
      btn.style.color = "white";
      btn.style.backgroundColor = "rgb(184, 142, 47)";
    }
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
      renderPaginationButtons();
    });
    pageButtonsContainer.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.classList.add("products__page-btn");
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts();
      renderPaginationButtons();
    }
  });
  pageButtonsContainer.appendChild(nextBtn);
}

function sortProducts(productsArray: Product[]): Product[] {
  const sortBy = sortBySelect.value;
  if (sortBy === "price-asc")
    return productsArray.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc")
    return productsArray.sort((a, b) => b.price - a.price);
  return productsArray;
}

function filterProducts(productsArray: Product[]): Product[] {
  const selectedCategory = categorySelect.value;
  if (selectedCategory === "all") return productsArray;
  return productsArray.filter((p) => p.category === selectedCategory);
}

function paginate(items: Product[], page: number, perPage: number): Product[] {
  const start = (page - 1) * perPage;
  return items.slice(start, start + perPage);
}

itemsPerPageSelect.addEventListener("change", () => {
  itemsPerPage = +itemsPerPageSelect.value;
  currentPage = 1;
  renderProducts();
  renderPaginationButtons();
});

sortBySelect.addEventListener("change", () => {
  currentPage = 1;
  renderProducts();
  renderPaginationButtons();
});

categorySelect.addEventListener("change", () => {
  currentPage = 1;
  renderProducts();
  renderPaginationButtons();
});

fetchProducts();

document.addEventListener("DOMContentLoaded", () => {
  if (!productListElement) {
    console.error("productListElement not found");
  }
});

function getFavorites(): Product[] {
  const raw = localStorage.getItem("favorites");
  return raw ? JSON.parse(raw) : [];
}

function saveFavorites(favorites: Product[]): void {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function addToFavorites(product: Product): void {
  const favorites = getFavorites();
  const alreadyExists = favorites.some((item) => item.id === product.id);
  if (alreadyExists) {
    iziToast.info({
      title: "Already in Favorites",
      message: `"${product.title}" is already in favorites.`,
      position: "bottomRight",
      timeout: 2000,
    });
    return;
  }

  favorites.push(product);
  saveFavorites(favorites);

  iziToast.success({
    title: "Added to Favorites",
    message: `"${product.title}" added!`,
    position: "bottomRight",
    timeout: 2500,
  });
}
