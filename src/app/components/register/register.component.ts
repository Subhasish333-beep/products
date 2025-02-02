import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
@Component({
  selector: 'app-register',
  imports: [ 
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  signUpForm: FormGroup = new FormGroup({});
  formBuilder = inject(FormBuilder);

  loginService: AuthenticationService = inject(AuthenticationService);
    snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.signUpForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      role: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });  
  }

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    try {
      // let signIn = this.signInForm.value
      // console.log(signIn);
      const signUp = {
        fullName: this.signUpForm.value.fullName,
        userRole: this.signUpForm.value.role,
        email: this.signUpForm.value.email,
        userPassword: this.signUpForm.value.password
      }
      this.loginService.registerUser(signUp).subscribe(
        (response) => {
          console.log("API Response:", response); // ✅ Logs actual API response          
          if ("status" in response && response.status)  {
            this.snackBar.open('User registered successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']  // Custom class (optional)
            });
          }
          else {
            this.snackBar.open('Sorry, something went wrong. Please try again.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['error-snackbar']
            });
          }
        },
        (error) => {
          console.error("API Error:", error);
          this.snackBar.open('Login failed. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      );
      
      // console.log(signIn);
      
    }
    catch(error) {
      console.log(error);
      
    }
  }
}
