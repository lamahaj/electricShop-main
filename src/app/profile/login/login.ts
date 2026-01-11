import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { User } from '../../modules/user';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loginError = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  goRegister(): void {
    this.router.navigateByUrl('/profile/register');
  }

  onLogin(): void {
    this.loginError = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginError = 'נא למלא שם משתמש וסיסמה';
      return;
    }

   const { username, password } = this.loginForm.value;
const user = this.userService.login(username, password);

if (user) {
sessionStorage.setItem('currentUser', JSON.stringify(user));
window.dispatchEvent(new Event('session-user-changed'));
} else {
  this.loginError = 'שם משתמש או סיסמה שגויים';
}
    if (user) {
      // דרישה: לשמור ב-session את המשתמש שהתחבר
      sessionStorage.setItem('currentUser', JSON.stringify(user));

      // דרישה: אחרי login מוצלח -> userDetails
      this.router.navigateByUrl('/profile/user-details');
    } else {
      // דרישה: חיווי אם פרטים שגויים
      this.loginError = 'שם משתמש או סיסמה שגויים';
    }
  }
}
