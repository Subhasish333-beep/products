import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication.service';


@Component({
  selector: 'app-login',
  imports: [
    MatFormFieldModule,
    MatDividerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  signInForm: FormGroup = new FormGroup({});
  formBuilder = inject(FormBuilder);
  router: Router = inject(Router);

  loginService: AuthenticationService = inject(AuthenticationService);
  snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.signInForm = this.formBuilder.group({
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
      const signIn = {
        email: this.signInForm.value.email,
        userPassword: this.signInForm.value.password
      }
      this.loginService.getUser(signIn).subscribe(
        (response: any) => {
          // console.log("API Response:", response); // ✅ Logs actual API response          
          // if("data" in response) {
          //   let userData = JSON.stringify(response?.data)
          //   localStorage.setItem("userData", userData);
          // }
          if (response?.data?.length > 0) {
            const firstItem = response.data[0]; // Get the first index
            localStorage.setItem("userData", JSON.stringify(firstItem)); // Store in localStorage
          }
          if ("message" in response && response.message === "success")  {
            this.snackBar.open('Login successful!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['success-snackbar']  // Custom class (optional)
            });
            this.router.navigateByUrl("/dashboard", {replaceUrl: true})
          }
          else {
            this.snackBar.open('Login failed. Please try again.', 'Close', {
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
      
      console.log(signIn);
      
    }
    catch(error) {
      console.log(error);
      
    }
  }
}
