// отображение всех товаров (карточки, фильтры)

import type { Product } from "../types";

export default class ProductListView {
  private productsCardsContainer: HTMLUListElement;

  constructor() {
    this.productsCardsContainer = document.querySelector(".products-cards")!;
  }

  renderProductCards(products: Product[]) {
    const cards = products
      .map((product: Product) => this.createProductCard(product))
      .join("");
    this.productsCardsContainer.innerHTML = cards;
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
                                <button id="add-to-cart-btn" class="add-to-cart-btn">
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
                                  .split(" ")
                                  .splice(0, 2)
                                  .join(" ")}</h5>
                                <p class="products-card--desc">
                                    ${product.description
                                      .split(" ")
                                      .splice(0, 3)
                                      .join(" ")}
                                </p>
                                <p class="products-card--price">USD $${
                                  product.price
                                }</p>
                            </div>
                        </li>
      `;
  }
}
