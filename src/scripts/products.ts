import type { Product } from '../types';

const productListElement = document.querySelector('.products__list');
const itemsPerPageSelect = document.getElementById('items-per-page');
const sortBySelect = document.getElementById('sort-by');
const infoText = document.querySelector('.filter-bar__info span');
const pageButtonsContainer = document.querySelector('.products__page-btns');

let products = [];
let currentPage = 1;
let itemsPerPage = +itemsPerPageSelect.value;
let totalProducts = 0;
let totalPages = 1;

async function fetchProducts() {
    const res = await fetch('https://dummyjson.com/products?limit=100');
    const data = await res.json();
    products = data.products;
    totalProducts = data.total;
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    renderPaginationButtons();
    renderProducts();
}

function renderProducts() {
    const sorted = sortProducts([...products]);
    const paginated = paginate(sorted, currentPage, itemsPerPage);

    // productListElement.innerHTML = paginated
    //   .map(
    //     (product) => `
    //       <li class="product-item">
    //         <div class="product-card">
    //           <img src="${product.thumbnail}" alt="${product.title}" />
    //           <h3>${product.title}</h3>
    //           <p>${product.brand}</p>
    //           <p>
    //             <span class="price">$${product.price}</span>
    //             ${
    //               product.discountPercentage > 0
    //                 ? `<span class="discount">-${product.discountPercentage}%</span>`
    //                 : ""
    //             }
    //           </p>
    //           ${product.rating > 4.5 ? '<p class="new-label">New</p>' : ""}
    //         </div>
    //       </li>
    //     `
    //   )
    //   .join("");

    productListElement.innerHTML = paginated
        .map((product: Product) => createProductCard(product))
        .join('');

    infoText.textContent = `Showing ${paginated.length} of ${totalProducts} products`;
}

function createProductCard(product: Product) {
    return `
        <li class="products-card">
                            <img
                                src="${product.images[0]}"
                                alt="${product.title}"
                                class="products-card--img"
                            />
                            <div class="card-overlay">
                                <button class="add-to-cart-btn">
                                    Add to cart
                                </button>
                                <div class="card-actions">
                                    <button class="card-action-btn">
                                        <img
                                            src="./public/icons/gridicons_share.svg"
                                            alt="share"
                                        />
                                        <span> Share </span>
                                    </button>
                                    <button class="card-action-btn">
                                        <img
                                            src="./public/icons/compare-svgrepo-com 1.svg"
                                            alt="compare"
                                        />
                                        <span> Compare </span>
                                    </button>
                                    <button class="card-action-btn">
                                        <img
                                            src="./public/icons/Heart.svg"
                                            alt="heart"
                                        />
                                        <span> Like </span>
                                    </button>
                                </div>
                            </div>
                            <div class="products-card-text">
                                <h5 class="products-card--title">${product.title
                                    .split(' ')
                                    .splice(0, 2)
                                    .join(' ')}</h5>
                                <p class="products-card--desc">
                                    ${product.description
                                        .split(' ')
                                        .splice(0, 3)
                                        .join(' ')}
                                </p>
                                <p class="products-card--price">USD $${
                                    product.price
                                }</p>
                            </div>
                        </li>
      `;
}

function renderPaginationButtons() {
    pageButtonsContainer.innerHTML = '';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Prev';
    prevBtn.disabled = currentPage === 1;
    prevBtn.classList.add('products__page-btn');
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage = -1;
            renderProducts();
            renderPaginationButtons();
            scrollToTop();
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
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.classList.add('products__page-btn');
        if (i === currentPage) {
            btn.disabled = true;
            btn.style.fontWeight = '700';
            btn.style.color = 'white';
            btn.style.backgroundColor = ' rgb(184, 142, 47)';
        }
        btn.addEventListener('click', () => {
            currentPage = i;
            renderProducts();
            renderPaginationButtons();
            scrollToTop();
        });
        pageButtonsContainer.appendChild(btn);
    }

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.classList.add('products__page-btn');
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
            renderPaginationButtons();
            scrollToTop();
        }
    });
    pageButtonsContainer.appendChild(nextBtn);
}

function sortProducts(productsArray) {
    const sortBy = sortBySelect.value;
    if (sortBy === 'price-asc')
        return productsArray.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc')
        return productsArray.sort((a, b) => b.price - a.price);
    return productsArray;
}

function paginate(items, page, perPage) {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
}

itemsPerPageSelect.addEventListener('change', () => {
    itemsPerPage = +itemsPerPageSelect.value;
    totalPages = Math.ceil(totalProducts / itemsPerPage);
    currentPage = 1;
    renderProducts();
    renderPaginationButtons();
});

sortBySelect.addEventListener('change', () => {
    currentPage = 1;
    renderProducts();
    renderPaginationButtons();
});

fetchProducts();
