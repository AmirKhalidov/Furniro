function getProductIdFromUrl(): number | null {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  return id ? parseInt(id) : null;
}

function renderProduct(product: any) {
  const titleElem = document.querySelector("h1");
  const productName = document.querySelector(".product-name");
  const titleSpanElem = document.querySelector(".product-details-title span");
  const priceElem = document.querySelector(".product-price");
  const descElem = document.querySelector(".product-description");
  const mainImageElem = document.querySelector(
    ".main-image img"
  ) as HTMLImageElement | null;
  const availabilityElem = document.querySelector(".product-status");
  const ratingElem = document.querySelector(".product-rating .stars");
  const reviewsCountElem = document.querySelector(
    ".product-rating .customer-review"
  );
  const thumbnailsContainer = document.querySelector(".thumbnails");

  if (titleElem) titleElem.textContent = product.title;
  if (productName) productName.textContent = product.title;
  if (titleSpanElem) titleSpanElem.textContent = product.title;

  if (priceElem) priceElem.textContent = `USD $${product.price.toFixed(2)}`;
  if (descElem) descElem.textContent = product.description;

  if (mainImageElem) {
    mainImageElem.src = product.images[0];
    mainImageElem.alt = `Main image of ${product.title}`;
  }

  if (thumbnailsContainer && Array.isArray(product.images)) {
    thumbnailsContainer.innerHTML = "";
    product.images.forEach((imgUrl: string, index: number) => {
      const thumb = document.createElement("img") as HTMLImageElement;
      thumb.src = imgUrl;
      thumb.alt = `Thumbnail ${index + 1}`;
      thumb.addEventListener("click", () => {
        if (mainImageElem) {
          mainImageElem.src = imgUrl;
          mainImageElem.alt = `Main image of ${product.title}`;
        }
      });
      thumbnailsContainer.appendChild(thumb);
    });
  }

  if (availabilityElem)
    availabilityElem.textContent =
      product.availabilityStatus || "Status unknown";

  if (ratingElem)
    ratingElem.textContent =
      "★".repeat(Math.round(product.rating)) +
      "☆".repeat(5 - Math.round(product.rating));

  if (reviewsCountElem)
    reviewsCountElem.textContent = `${product.reviews.length} Customer Review${
      product.reviews.length !== 1 ? "s" : ""
    }`;

  document.querySelector("#sku")!.textContent = product.sku;
  document.querySelector("#category")!.textContent = product.category;

  const tags = product.tags || product.title.split(" ");
  const tagsContainer = document.querySelector("#tags");
  if (tagsContainer) {
    tagsContainer.innerHTML = tags
      .map((tag: string) => `<a href="#">${tag}</a>`)
      .join(", ");
  }
}

async function fetchProductById(id: number) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error("Product not found");
    const product = await res.json();
    return product;
  } catch (error) {
    console.error(error);
    alert("Ошибка загрузки товара");
    return null;
  }
}

async function main() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    alert("Product ID is missing in URL");
    return;
  }

  const product = await fetchProductById(productId);
  if (product) {
    renderProduct(product);
  }
}

(window as any).increaseQuantity = () => {
  const input = document.querySelector("#quantity") as HTMLInputElement;
  input.value = String(+input.value + 1);
};

(window as any).decreaseQuantity = () => {
  const input = document.querySelector("#quantity") as HTMLInputElement;
  const current = +input.value;
  if (current > 1) input.value = String(current - 1);
};

main();
