import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Product } from '../modules/product';
import { ProductService } from '../service';
import { Router } from '@angular/router';
import { CartService } from '../services/cart';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products implements OnInit, OnChanges {

  @Input() selectedCategoryId: number | null = null;

  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading: boolean = true;

  constructor(
  private productService: ProductService,
  private router: Router,
  private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCategoryId'] && this.allProducts.length) {
      console.log('🔄 Category changed to:', this.selectedCategoryId);
      this.filterProducts();
    }
  }

  private loadProducts(): void {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.allProducts = products;
        this.isLoading = false;
        console.log('✅ Products loaded:', this.allProducts.length);
        this.filterProducts();
      },
      error: (err) => {
        console.error('💥 Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  private filterProducts(): void {
    if (this.selectedCategoryId === null) {
      this.filteredProducts = this.allProducts;
      console.log('📦 Showing all products:', this.filteredProducts.length);
    } else {
      this.filteredProducts = this.allProducts.filter(
        p => p.categoryId === this.selectedCategoryId
      );
      console.log(`📦 Filtered products for category ${this.selectedCategoryId}:`, this.filteredProducts.length);
    }
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }
  addToCart(product: Product): void {
  this.cartService.addToCart(product);
  window.dispatchEvent(new Event('cart-updated')); // עדכון הבאג' בנאבר
}
}
