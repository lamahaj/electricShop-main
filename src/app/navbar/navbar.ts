import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart';
import { UserService } from '../services/user-service'; // ← הוסף את זה

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  isLoggedIn = false;
  userName = '';
  userImage = '';
  isProfileMenuOpen = false;
  isAdmin = false;
  cartItemsCount = 0;

  constructor(
    private router: Router,
    private cartService: CartService,
    private userService: UserService // ← הוסף את זה
  ) {}

  ngOnInit(): void {
    this.loadUserFromSession();
    this.updateCartCount();

    window.addEventListener('session-user-changed', () => {
      this.loadUserFromSession();
    });

    window.addEventListener('cart-updated', () => {
      this.updateCartCount();
    });
  }

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
      ? 'assets/female-avatar.webp'
      : 'assets/avatar-male.jpg';
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  goUserDetails(): void {
    this.isProfileMenuOpen = false;
    this.router.navigateByUrl('/profile/user-details');
  }

  // ✅ תיקון - קריאה ל-UserService.logout()
  onLogout(): void {
    this.isMenuOpen = false;
    this.isProfileMenuOpen = false;

    // קריאה לפונקציה המרכזית של logout
    this.userService.logout();
    
    // עדכון Event למאזינים אחרים
    window.dispatchEvent(new Event('session-user-changed'));

    // ניווט למסך Login
    this.router.navigateByUrl('/profile/login');
  }
}