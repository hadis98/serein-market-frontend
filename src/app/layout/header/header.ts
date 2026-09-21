import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../core/state/cart-store';
import { AuthStore } from '../../core/auth/auth-store';
import { WishlistStore } from '../../core/state/wishlist-store';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly cart = inject(CartStore);
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly wishlist = inject(WishlistStore);
  readonly searchTerm = signal('');

  updateSearchTerm(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  async submitSearch(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const search = this.searchTerm().trim();

    if (!search) {
      return;
    }

    await this.router.navigate(['/products'], { queryParams: { search } });
  }

  async logout(): Promise<void> {
    this.auth.logout();
    await this.router.navigate(['/']);
  }

  constructor() {
    effect(() => {
      if (this.auth.isLoggedIn()) {
        void this.cart.load();
        void this.wishlist.load();
      } else {
        this.cart.reset();
        this.wishlist.reset();
      }
    });
  }
}
