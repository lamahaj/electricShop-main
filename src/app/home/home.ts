import { Component, OnInit } from '@angular/core';
import { Product } from '../modules/product';
import { ProductService } from '../service';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {

  products: Product[] = [];
  popularProducts: Product[] = [];
  isLoading: boolean = true;

  constructor(private productService: ProductService ,private cartService: CartService) {}

  ngOnInit(): void {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });

    this.productService.getPopularProducts().subscribe({
      next: (popular: Product[]) => {
        this.popularProducts = popular;
        console.log('Popular products:', this.popularProducts);
      },
      error: (err) => {
        console.error('Error loading popular products:', err);
      }
    });
  }


addToCart(product: Product): void {
  this.cartService.addToCart(product); 
  window.dispatchEvent(new Event('cart-updated')); 
}
}
