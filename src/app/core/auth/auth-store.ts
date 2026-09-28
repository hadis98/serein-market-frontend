import { computed, inject, Injectable, signal } from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { AuthApi } from './auth-api';

import { AuthTokenService } from './auth-token.service';

import type {
  AuthResponse,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../models/auth.model';

const USER_STORAGE_KEY = 'serein-user';

@Injectable({
  providedIn: 'root',
})
export class AuthStore {
  private readonly authApi = inject(AuthApi);

  private readonly tokenService = inject(AuthTokenService);

  private readonly userState = signal<AuthUser | null>(this.loadStoredUser());

  readonly user = this.userState.asReadonly();

  readonly isLoggedIn = computed(
    () => this.userState() !== null && this.tokenService.token() !== null,
  );

  readonly isAdmin = computed(() => this.userState()?.role === 'ADMIN');

  readonly firstName = computed(() => {
    const name = this.userState()?.name ?? '';

    return name.split(' ')[0] ?? '';
  });

  async register(request: RegisterRequest): Promise<void> {
    try {
      const response = await firstValueFrom(this.authApi.register(request));

      this.saveSession(response);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Registration failed.'));
    }
  }

  async login(request: LoginRequest): Promise<void> {
    try {
      const response = await firstValueFrom(this.authApi.login(request));

      this.saveSession(response);
    } catch (error) {
      throw new Error(this.getErrorMessage(error, 'Login failed.'));
    }
  }

  async restoreSession(): Promise<void> {
    if (!this.tokenService.get()) {
      this.logout();
      return;
    }

    try {
      const user = await firstValueFrom(this.authApi.me());

      this.setUser(user);
    } catch {
      this.logout();
    }
  }

  logout(): void {
    this.userState.set(null);

    this.tokenService.clear();

    localStorage.removeItem(USER_STORAGE_KEY);
  }

  private saveSession(response: AuthResponse): void {
    this.tokenService.set(response.accessToken);

    this.setUser(response.user);
  }

  private setUser(user: AuthUser): void {
    const sessionUser = this.toSessionUser(user);
    this.userState.set(sessionUser);

    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  private loadStoredUser(): AuthUser | null {
    const saved = localStorage.getItem(USER_STORAGE_KEY);

    if (!saved) {
      return null;
    }

    try {
      const user = JSON.parse(saved) as AuthUser;
      return this.toSessionUser(user);
    } catch {
      return null;
    }
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const message = error.error?.message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    if (error instanceof Error) {
      return error.message;
    }

    return fallback;
  }

  async updateProfile(_request: unknown): Promise<void> {
    throw new Error('Profile editing is temporarily unavailable.');
  }

  private toSessionUser(user: AuthUser): AuthUser {
    return user;
  }
}
