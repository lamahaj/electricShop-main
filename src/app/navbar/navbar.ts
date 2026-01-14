// navbar.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart';


@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isMenuOpen = false;

  // מצב משתמש
  isLoggedIn = false;
  userName = '';
  userImage = '';
  isProfileMenuOpen = false;
  isAdmin = false;

  // מצב עגלה ✅
  cartItemsCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService // ← הוספנו
  ) {}

  ngOnInit(): void {
    this.loadUserFromSession();
    this.updateCartCount(); // ← הוספנו

    // עדכון אחרי login/logout
    window.addEventListener('session-user-changed', () => {
      this.loadUserFromSession();
    });

    // עדכון אחרי שינוי בעגלה ✅
    window.addEventListener('cart-updated', () => {
      this.updateCartCount();
    });
  }

  // פונקציה חדשה לעדכון מספר פריטים בעגלה ✅
  private updateCartCount(): void {
    this.cartItemsCount = this.cartService.getCartItemsCount();
  }

  private loadUserFromSession(): void {
    const raw = sessionStorage.getItem('currentUser');
    const authRaw = sessionStorage.getItem('auth');

    if (raw && authRaw) {
      const user = JSON.parse(raw);
      const auth = JSON.parse(authRaw);

      this.isLoggedIn = true;
      this.userName = user.fullName || user.username || '';
      this.userImage = auth.image || user.profileImage || '';
      this.isAdmin = auth.isAdmin;
    } else {
      this.isLoggedIn = false;
      this.userName = '';
      this.userImage = '';
      this.isAdmin = false;
      this.isProfileMenuOpen = false;
    }
  }

  defaultAvatar(): string {
    const raw = sessionStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    const gender = user?.gender;

    return gender === 'female'
      ? 'https://ui-avatars.com/api/?name=Female&background=f368e0&color=fff&size=100'
      : 'https://ui-avatars.com/api/?name=Male&background=0D8ABC&color=fff&size=100';
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  goUserDetails(): void {
    this.isProfileMenuOpen = false;
    this.router.navigateByUrl('/profile/user-details');
  }

  onLogout(): void {
    this.isMenuOpen = false;
    this.isProfileMenuOpen = false;

    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('auth'); // ← כדאי גם את זה
    window.dispatchEvent(new Event('session-user-changed'));

    this.router.navigateByUrl('/profile/login');
  }
  
}