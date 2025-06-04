import type { Product } from "../types";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const CART_KEY = "cart";

export function getCart(): any[] {
  const cartRaw = localStorage.getItem(CART_KEY);
  return cartRaw ? JSON.parse(cartRaw) : [];
}

export function saveCart(cart: any[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product): void {
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
    title: "Success",
    message: `"${product.title}" added to cart!`,
    position: "topRight",
  });
}
