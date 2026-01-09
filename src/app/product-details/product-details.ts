import { Component, OnInit } from '@angular/core';
import { Product } from '../modules/product';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../service';

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
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      console.log('🔍 Looking for product ID:', this.productId);
      
      // תמיד נחכה שהנתונים ייטענו (גם אם כבר התחילו להיטען)
      this.loadProduct();
    });
  }

  private loadProduct(): void {
    // נבדוק אם המוצרים כבר נטענו
    const allProducts = this.productService.getAllProducts();
    
    if (allProducts.length > 0) {
      // המוצרים כבר קיימים
      console.log('✅ Products already loaded, total:', allProducts.length);
      this.product = this.productService.getProductById(this.productId!);
      this.isLoading = false;
      
      if (!this.product) {
        console.log('❌ Product not found with ID:', this.productId);
        this.notFound = true;
      } else {
        console.log('✅ Product found:', this.product.name);
      }
    } else {
      // צריך לטעון את המוצרים
      console.log('⏳ Loading products from server...');
      this.productService.fetchProducts().subscribe({
        next: () => {
          console.log('✅ Products loaded successfully');
          this.product = this.productService.getProductById(this.productId!);
          this.isLoading = false;
          
          if (!this.product) {
            console.log('❌ Product not found after loading');
            this.notFound = true;
          } else {
            console.log('✅ Product found:', this.product.name);
          }
        },
        error: (err) => {
          console.error('💥 Error loading products:', err);
          this.isLoading = false;
          this.notFound = true;
        }
      });
    }
  }

  goBackHome(): void {
    this.router.navigate(['/']);
  }

  getSpecKeys(): string[] {
    return this.product?.specifications ? Object.keys(this.product.specifications) : [];
  }
}