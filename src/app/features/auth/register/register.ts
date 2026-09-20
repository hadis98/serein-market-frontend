import { Component, inject, signal } from '@angular/core';

import { email, form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthStore } from '../../../core/auth/auth-store';

interface RegisterFormModel {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);

  readonly errorMessage = signal('');
  readonly model = signal<RegisterFormModel>({
    name: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  readonly registerForm = form(
    this.model,
    (path) => {
      required(path.name, {
        message: 'Name is required',
      });

      required(path.email, {
        message: 'Email is required',
      });

      email(path.email, {
        message: 'Enter a valid email address',
      });

      required(path.phoneNumber, {
        message: 'Mobile number is required',
      });

      minLength(path.phoneNumber, 10, {
        message: 'Enter a valid mobile number',
      });

      required(path.password, {
        message: 'Password is required',
      });

      minLength(path.password, 6, {
        message: 'Password must be at least 6 characters',
      });
    },
    {
      submission: {
        action: async () => {
          this.errorMessage.set('');
          const model = this.model();
          try {
            await this.auth.register({
              name: model.name,
              email: model.email,
              phoneNumber: model.phoneNumber,
              password: model.password,
            });
            await this.router.navigate(['/']);
          } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'Registeration failed');
          }
        },
      },
    },
  );
}
