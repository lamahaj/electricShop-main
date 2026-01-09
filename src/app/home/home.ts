import { Component, OnInit } from '@angular/core';
import { Product } from '../modules/product';
import { ProductService } from '../service';

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

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // נחכה שהנתונים ייטענו מהשרת
    this.productService.fetchProducts().subscribe({
      next: (data) => {
        console.log('Data loaded:', data);
        this.products = this.productService.getAllProducts();
        this.popularProducts = this.productService.getPopularProducts();
        this.isLoading = false;
        console.log('Popular products:', this.popularProducts);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }
}