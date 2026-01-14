// cart.service.ts
import { Injectable } from '@angular/core';
import { Cart, CartProduct } from '../modules/cart';
import { Product } from '../modules/product';
import { User } from '../modules/user';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart;

  constructor() {
    this.cart = new Cart();
  }

  // פונקציה להודעה על שינוי בעגלה
  private notifyCartUpdate(): void {
    window.dispatchEvent(new Event('cart-updated'));
  }

  // קבלת העגלה הנוכחית
  getCart(): Cart {
    return this.cart;
  }

  // הוספת מוצר לעגלה
  addToCart(product: Product): void {
    const existingCartProduct = this.cart.products.find(
      cp => cp.product.id === product.id
    );

    if (existingCartProduct) {
      existingCartProduct.quantity++;
    } else {
      const cartProduct = new CartProduct(product);
      this.cart.products.push(cartProduct);
    }

    this.cart.calculateTotal();
    this.notifyCartUpdate(); // ← הוספנו
  }

  // הסרת מוצר מהעגלה
  removeFromCart(product: Product): void {
    this.cart.products = this.cart.products.filter(
      cp => cp.product.id !== product.id
    );
    this.cart.calculateTotal();
    this.notifyCartUpdate(); // ← הוספנו
  }

  // הוספת כמות למוצר
  increaseQuantity(product: Product): void {
    const cartProduct = this.cart.products.find(
      cp => cp.product.id === product.id
    );

    if (cartProduct) {
      cartProduct.quantity++;
      this.cart.calculateTotal();
      this.notifyCartUpdate(); // ← הוספנו
    }
  }

  // הורדת כמות למוצר
  decreaseQuantity(product: Product): void {
    const cartProduct = this.cart.products.find(
      cp => cp.product.id === product.id
    );

    if (cartProduct) {
      if (cartProduct.quantity > 1) {
        cartProduct.quantity--;
        this.cart.calculateTotal();
      } else {
        this.removeFromCart(product);
        return; // removeFromCart כבר קורא ל-notifyCartUpdate
      }
      this.notifyCartUpdate(); // ← הוספנו
    }
  }

  // עדכון משתמש (לאחר login)
  updateUser(user: User): void {
    this.cart.user = user;
  }

  // ביצוע תשלום וניקוי עגלה
  checkout(): void {
    this.cart.isPaid = true;
    this.clearCart();
  }

  // ניקוי עגלה - שינינו ל-public ✅
  public clearCart(): void {
    this.cart = new Cart(this.cart.user);
    this.notifyCartUpdate(); // ← הוספנו
  }

  // קבלת מספר פריטים בעגלה
  getCartItemsCount(): number {
    return this.cart.products.reduce((count, cp) => count + cp.quantity, 0);
  }

  // קבלת סכום העגלה
  getTotalAmount(): number {
    return this.cart.totalAmount;
  }
}

export { Cart };
