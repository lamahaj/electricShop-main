
import { Product } from './product'; 
import { User } from './user'; 

export class CartProduct {
  product: Product;
  quantity: number;

  constructor(product: Product, quantity: number = 1) {
    this.product = product;
    this.quantity = quantity;
  }
}

export class Cart {
  user: User | null;
  products: CartProduct[];
  isPaid: boolean;
  totalAmount: number;

  constructor(
    user: User | null = null,
    products: CartProduct[] = [],
    isPaid: boolean = false,
    totalAmount: number = 0
  ) {
    this.user = user;
    this.products = products;
    this.isPaid = isPaid;
    this.totalAmount = totalAmount;
  }

  calculateTotal(): number {
    this.totalAmount = this.products.reduce((sum, cartProduct) => {
      return sum + (cartProduct.product.price * cartProduct.quantity);
    }, 0);
    return this.totalAmount;
  }
}