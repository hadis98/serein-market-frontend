import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/ui/toast/toast';
import { AuthStore } from './core/auth/auth-store';

@Component({
  imports: [RouterOutlet, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly auth = inject(AuthStore);
  protected readonly title = signal('e-commerce-clothes-shop');

  constructor() {
    void this.auth.restoreSession();
  }
}
