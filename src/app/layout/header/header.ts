import { Component, effect, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../core/state/cart-store';
import { AuthStore } from '../../core/auth/auth-store';
import { WishlistStore } from '../../core/state/wishlist-store';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  imports: [RouterLink, RouterLinkActive, Icon],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly cart = inject(CartStore);
  readonly auth = inject(AuthStore);
  private readonly router = inject(Router);
  readonly wishlist = inject(WishlistStore);

  readonly mobileMenuOpen = signal(false);

  openMobileMenu(): void {
    this.mobileMenuOpen.set(true);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  @HostListener('document:keydown.escape')
  closeMobileMenuOnEscape(): void {
    this.closeMobileMenu();
  }

  async logout(): Promise<void> {
    this.auth.logout();
    this.closeMobileMenu();
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
