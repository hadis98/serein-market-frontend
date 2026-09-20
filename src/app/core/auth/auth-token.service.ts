import { Injectable, signal } from '@angular/core';

const TOKEN_KEY = 'serein-access-token';
@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private readonly tokenState = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly token = this.tokenState.asReadonly();

  get(): string | null {
    return this.tokenState();
  }

  set(token: string): void {
    this.tokenState.set(token);

    localStorage.setItem(TOKEN_KEY, token);
  }

  clear(): void {
    this.tokenState.set(null);

    localStorage.removeItem(TOKEN_KEY);
  }
}
