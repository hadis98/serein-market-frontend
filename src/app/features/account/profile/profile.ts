import { Component, inject, signal } from '@angular/core';
import { AuthStore } from '../../../core/auth/auth-store';
import { RouterLink } from '@angular/router';
import { form, FormField, FormRoot, minLength, required } from '@angular/forms/signals';
import { ToastStore } from '../../../core/state/toast-store';

interface ProfileFormModel {
  name: string;
  phoneNumber: string;
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

  readonly user = this.auth.user();

  readonly model = signal<ProfileFormModel>({
    name: this.user?.name ?? '',
    phoneNumber: this.user?.phoneNumber ?? '',
    password: '',
  });

  readonly profileForm = form(
    this.model,

    (path) => {
      required(path.name, {
        message: 'Name is required',
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
        message: 'Password must contain at least 6 characters',
      });
    },

    {
      submission: {
        action: async () => {
          console.log('submit');
          const user = this.auth.user();

          if (!user) {
            return;
          }

          this.errorMessage.set('');

          try {
            await this.auth.updateProfile({
              CustId: user.id,
              Name: this.model().name,
              MobileNo: this.model().phoneNumber,
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
    const customer = this.auth.user();

    if (!customer) {
      return;
    }

    this.model.set({
      name: customer.name,
      phoneNumber: customer.phoneNumber,
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
