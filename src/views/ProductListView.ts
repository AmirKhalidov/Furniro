// отображение всех товаров (карточки, фильтры)

import type { Product } from '../types';

export default class ProductListView {
    private productsCardsContainer: HTMLUListElement;

    private productListElement: HTMLElement;
    private itemsPerPageSelect: HTMLSelectElement;
    private sortBySelect: HTMLSelectElement;
    private infoText: HTMLElement;
    private pageButtonsContainer: HTMLElement;

    constructor() {
        this.productsCardsContainer =
            document.querySelector('.products-cards')!;

        this.productListElement = document.querySelector('.products__list')!;
        this.itemsPerPageSelect = document.getElementById(
            'items-per-page'
        ) as HTMLSelectElement;
        this.sortBySelect = document.getElementById(
            'sort-by'
        ) as HTMLSelectElement;
        this.infoText = document.querySelector('.filter-bar__info span')!;
        this.pageButtonsContainer = document.querySelector(
            '.products__page-btns'
        )!;
    }

    renderProductCards(products: Product[]) {
        const cards = products
            .map((product: Product) => this.createProductCard(product))
            .join('');
        this.productsCardsContainer.innerHTML = cards;
    }

    renderProducts(products: Product[], showing: number, total: number) {
        this.productListElement.innerHTML = products
            .map((product) => this.createProductCard(product))
            .join('');
        this.infoText.textContent = `Showing ${showing} of ${total} products`;
    }

    createProductCard(product: Product) {
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

    renderPagination(currentPage: number, totalPages: number, onPageChange: (page: number) => void) {
        // Existing pagination render logic
    }
}
