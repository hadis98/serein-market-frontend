import { Component, effect, inject, signal } from '@angular/core';
import { FormField, form, FormRoot, required } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthStore } from '../../../core/auth/auth-store';

interface LoginFormModel {
  mobileNo: string;
  password: string;
}

@Component({
  imports: [FormField, FormRoot, RouterLink],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly errorMessage = signal('');
  readonly model = signal<LoginFormModel>({
    mobileNo: this.route.snapshot.queryParamMap.get('mobileNo') ?? '',
    password: '',
  });

  readonly loginForm = form(
    this.model,
    (path) => {
      required(path.mobileNo, {
        message: 'Mobile number is required',
      });

      required(path.password, {
        message: 'Password is required',
      });
    },
    {
      submission: {
        action: async () => {
          this.errorMessage.set('');

          try {
            await this.auth.login({
              UserName: this.model().mobileNo,

              UserPassword: this.model().password,
            });

            const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/';

            await this.router.navigateByUrl(returnUrl);
          } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'Login failed');
          }
        },
      },
    },
  );
}
