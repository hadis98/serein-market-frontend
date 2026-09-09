import { Component, inject, signal } from '@angular/core';
import { AuthStore } from '../../../core/auth/auth-store';
import { RouterLink } from '@angular/router';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { ToastStore } from '../../../core/state/toast-store';

interface ProfileFormModel {
  name: string;
  mobileNo: string;
  password: string;
}

@Component({
  imports: [RouterLink, FormField, FormRoot],
  selector: 'app-profile',
  styleUrl: './profile.css',
  templateUrl: './profile.html',
})
export class Profile {
  readonly auth = inject(AuthStore);
  private readonly toast = inject(ToastStore);

  readonly editing = signal(false);
  readonly errorMessage = signal('');

  private readonly customer = this.auth.customer();

  readonly model = signal<ProfileFormModel>({
    name: this.customer?.name ?? '',
    mobileNo: this.customer?.mobileNo ?? '',
    password: '',
  });

  readonly profileForm = form(
    this.model,

    (path) => {
      required(path.name, {
        message: 'Name is required',
      });

      required(path.mobileNo, {
        message: 'Mobile number is required',
      });

      minLength(path.mobileNo, 10, {
        message: 'Enter a valid mobile number',
      });

      required(path.password, {
        message: 'Password is required',
      });

      minLength(path.password, 6, {
        message: 'Password must contain at least 6 characters',
      });
    },

    {
      submission: {
        action: async () => {
          console.log('submit');
          const customer = this.auth.customer();

          if (!customer) {
            return;
          }

          this.errorMessage.set('');

          try {
            await this.auth.updateProfile({
              CustId: customer.custId,
              Name: this.model().name,
              MobileNo: this.model().mobileNo,
              Password: this.model().password,
            });

            this.toast.show('Profile updated successfully.');

            this.editing.set(false);
          } catch (error) {
            this.errorMessage.set(error instanceof Error ? error.message : 'Profile update failed');
          }
        },
      },
    },
  );

  startEditing() {
    const customer = this.auth.customer();

    if (!customer) {
      return;
    }

    this.model.set({
      name: customer.name,
      mobileNo: customer.mobileNo,
      password: '',
    });

    this.errorMessage.set('');

    this.editing.set(true);
  }

  cancelEditing() {
    this.editing.set(false);
    this.errorMessage.set('');
  }
}
