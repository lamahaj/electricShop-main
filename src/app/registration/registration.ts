import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { User } from '../modules/user';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.html',
  styleUrls: ['./registration.css'],
})
export class Registration implements OnInit {
  registerForm!: FormGroup;
  currentUser: User | null = null;
  showPassword = false;
  showConfirmPassword = false;
  selectedImage: string | null = null;
  previewImage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.strongPasswordValidator]],
      confirmPassword: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      birthDate: ['', [Validators.required, this.ageValidator]],
      gender: ['male', Validators.required],
      profileImage: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    // טעינת משתמש נוכחי אם קיים
    this.currentUser = this.userService.getCurrentUser();
  }

  // Validator לסיסמה חזקה
  strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasMinLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;

    return !passwordValid ? {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasMinLength
      }
    } : null;
  }

  // Validator להתאמת סיסמאות
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;
    return password.value === confirmPassword.value ? null : { passwordsMismatch: true };
  }

  // Validator לגיל - לפחות 13 שנים
  ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age < 13 ? { tooYoung: true } : null;
  }

  // Getters לשדות הטופס
  get passwordControl() {
    return this.registerForm.get('password');
  }

  get confirmPasswordControl() {
    return this.registerForm.get('confirmPassword');
  }

  get fullNameControl() {
    return this.registerForm.get('fullName');
  }

  get birthDateControl() {
    return this.registerForm.get('birthDate');
  }

  get genderControl() {
    return this.registerForm.get('gender');
  }

  // בדיקות חוזק סיסמה
  get hasMinLength(): boolean {
    const errors = this.passwordControl?.errors?.['passwordStrength'];
    if (!errors && this.passwordControl?.value) return true;
    return errors ? errors.hasMinLength : false;
  }

  get hasUpperCase(): boolean {
    const errors = this.passwordControl?.errors?.['passwordStrength'];
    if (!errors && this.passwordControl?.value) return true;
    return errors ? errors.hasUpperCase : false;
  }

  get hasLowerCase(): boolean {
    const errors = this.passwordControl?.errors?.['passwordStrength'];
    if (!errors && this.passwordControl?.value) return true;
    return errors ? errors.hasLowerCase : false;
  }

  get hasNumeric(): boolean {
    const errors = this.passwordControl?.errors?.['passwordStrength'];
    if (!errors && this.passwordControl?.value) return true;
    return errors ? errors.hasNumeric : false;
  }

  get passwordsMatch(): boolean {
    return !this.registerForm.errors?.['passwordsMismatch'];
  }

  // תמונת ברירת מחדל לפי מין
  getDefaultImagePreview(): string {
    const gender = this.genderControl?.value || 'male';
    return gender === 'male' 
      ? 'assets/avatar-male.jpg' 
      : 'assets/female-avatar.webp';
  }

  // פונקציות תצוגת סיסמה
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // טיפול בבחירת תמונה
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // בדיקת סוג קובץ
      if (!file.type.startsWith('image/')) {
        alert('נא לבחור קובץ תמונה בלבד');
        return;
      }

      // בדיקת גודל (מקסימום 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('גודל התמונה לא יכול לעבור 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImage = e.target.result;
        this.registerForm.patchValue({ profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  // הסרת תמונה
  removeImage(): void {
    this.previewImage = null;
    this.registerForm.patchValue({ profileImage: '' });
    const fileInput = document.getElementById('imageInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  get allUsers(): User[] {
    return this.userService.getUsers();
  }

  onRegister() {
    if (this.registerForm.valid) {
      console.log("onRegister");
      
      const { confirmPassword, ...userData } = this.registerForm.value;
      
      try {
        this.userService.register(userData).subscribe({
          next: () => {
            this.registerForm.reset();
            this.registerForm.patchValue({ gender: 'male' });
            this.previewImage = null;
            alert('ההרשמה בוצעה בהצלחה! כעת תוכל להתחבר');
            this.router.navigateByUrl('/profile/login');
          },
          error: (err) => {
            if (err.message.includes('כבר קיים')) {
              alert('משתמש עם מייל זה כבר קיים במערכת');
            } else {
              alert('אירעה שגיאה בהרשמה. נסה שוב.');
            }
          }
        });
      } catch (error: any) {
        alert(error.message || 'אירעה שגיאה בהרשמה');
      }
    } else {
      alert('אנא מלא את כל השדות כנדרש');
    }
  }

  logout() {
    this.userService.logout();
    this.currentUser = null;
    alert('התנתקת בהצלחה');
    window.dispatchEvent(new Event('session-user-changed'));
  }

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}