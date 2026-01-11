import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  standalone: false,
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const raw = sessionStorage.getItem('currentUser');
    this.currentUser = raw ? JSON.parse(raw) : null;

    if (!this.currentUser) {
      this.router.navigateByUrl('/profile/login');
    }
  }
  
}