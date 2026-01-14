import { Component, OnInit } from '@angular/core';
import { Product } from '../modules/product';
import { Router } from '@angular/router';
import { Cart as CartModel, CartProduct } from '../modules/cart'; // ← שינוי חשוב
import { CartService } from '../services/cart';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart implements OnInit {
cart: CartModel = new CartModel(null, [], false, 0);
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
    this.checkLoginStatus();

    // האזנה לשינויים ב-login
    window.addEventListener('session-user-changed', () => {
      this.checkLoginStatus();
    });
  }

  loadCart(): void {
  this.cart = this.cartService.getCart();
  this.cart.calculateTotal();
}

  checkLoginStatus(): void {
    this.isLoggedIn = this.userService.isLoggedIn();
  }

  increaseQuantity(product: Product): void {
    this.cartService.increaseQuantity(product);
    this.loadCart();
  }

  decreaseQuantity(product: Product): void {
    this.cartService.decreaseQuantity(product);
    this.loadCart();
  }

  removeProduct(product: Product): void {
    if (confirm(`האם אתה בטוח שברצונך להסיר את ${product.name} מהעגלה?`)) {
      this.cartService.removeFromCart(product);
      this.loadCart();
    }
  }

  clearCart(): void {
    if (confirm('האם אתה בטוח שברצונך לרוקן את העגלה?')) {
      this.cartService.clearCart();
      this.loadCart();
    }
  }

  checkout(): void {
    if (!this.isLoggedIn) {
      alert('נא להתחבר לפני ביצוע תשלום');
      this.router.navigateByUrl('/profile/login');
      return;
    }

    if (this.cart.products.length === 0) {
      alert('העגלה ריקה');
      return;
    }

    if (confirm(`האם לבצע תשלום בסך ${this.cart.totalAmount}₪?`)) {
      this.cartService.checkout();
      this.loadCart();
      alert('התשלום בוצע בהצלחה! תודה על הקנייה.');
      this.router.navigateByUrl('/');
    }
  }

  getTotalPrice(): number {
    return this.cart.totalAmount;
  }

  getItemPrice(cartProduct: CartProduct): number {
    return cartProduct.product.price * cartProduct.quantity;
  }
}