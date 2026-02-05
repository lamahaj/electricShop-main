import { Component, OnInit } from '@angular/core';
import { Product } from '../modules/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service';
import { CartService } from '../services/cart'; 

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {

  product?: Product;
  productId?: number;
  isLoading: boolean = true;
  notFound: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = Number(params['id']);
      console.log('🔍 Looking for product ID:', this.productId);
      this.loadProduct();
    });
  }

  private loadProduct(): void {
    if (!this.productId) {
      this.notFound = true;
      this.isLoading = false;
      return;
    }

    this.isLoading = true;
    this.notFound = false;

    this.productService.getProductById(this.productId).subscribe({
      next: (p: Product) => {
        this.product = p;
        this.isLoading = false;
        console.log('✅ Product found:', this.product?.name);
      },
      error: (err) => {
        console.error('💥 Product not found / error:', err);
        this.product = undefined;
        this.isLoading = false;
        this.notFound = true;
      }
    });
  }

  
  addToCart(): void {
    if (!this.product) {
      return;
    }

    if (!this.product.inStock) {
      alert('המוצר אזל מהמלאי');
      return;
    }

    this.cartService.addToCart(this.product);
    
   
    alert(`✅ ${this.product.name} התוסף לעגלה בהצלחה!`);
    

  }

  goBackHome(): void {
    this.router.navigate(['/']);
  }

  getSpecKeys(): string[] {
    return this.product?.specifications ? Object.keys(this.product.specifications) : [];
  }
}