export class Product {
  id: number;
  name: string;
  price: number;
  image: string;
  remainingStock: number;  // ← שימו לב: זה נקרא remainingStock ב-JSON!
  stock: number;
  brand: string;
  categoryId: number;
  description: string;
  category: string;
  specifications: { [key: string]: string };  // ← שימו לב: זה נקרא specifications ב-JSON!

  constructor(
    id: number,
    name: string,
    price: number,
    image: string,
    remainingStock: number,  // ← תואם ל-JSON
    stock: number,
    brand: string,
    categoryId: number,
    description: string,
    category: string,
    specifications: { [key: string]: string }  
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
    this.remainingStock = remainingStock;
    this.stock = stock;
    this.brand = brand;
    this.categoryId = categoryId;
    this.description = description;
    this.category = category;
    this.specifications = specifications;
  }

  // Getters מחושבים
  get soldCount(): number {
    return this.stock - this.remainingStock;
  }

  get salesPercentage(): number {
    if (this.stock === 0) return 0;
    return Math.round((this.soldCount / this.stock) * 100);
  }

  get inStock(): boolean {
    return this.remainingStock > 0;
  }
}