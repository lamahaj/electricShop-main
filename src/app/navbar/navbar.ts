import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  cartItemsCount = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserFromSession();
    

    // עדכון מיידי אחרי login/logout
    window.addEventListener('session-user-changed', () => {
      this.loadUserFromSession();
    });
  }

  private loadUserFromSession(): void {
    const raw = sessionStorage.getItem('currentUser');

    if (raw) {
      const user = JSON.parse(raw);
      this.isLoggedIn = true;
      this.userName = user.fullName || user.username || '';
      this.userImage = user.profileImage || '';
    } else {
      this.isLoggedIn = false;
      this.userName = '';
      this.userImage = '';
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

  // התנתקות לפי דרישה
  onLogout(): void {
    this.isMenuOpen = false;
    this.isProfileMenuOpen = false;

    sessionStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('session-user-changed'));

    this.router.navigateByUrl('/profile/login');
  }
}
