import { Component, inject } from '@angular/core';
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

  async logout() {
    this.auth.logout();
    await this.router.navigate(['/']);
  }
}
