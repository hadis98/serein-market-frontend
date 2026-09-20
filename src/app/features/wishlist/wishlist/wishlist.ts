import { Component, inject, OnInit } from '@angular/core';
import { WishlistStore } from '../../../core/state/wishlist-store';
import { ProductCard } from '../../products/product-card/product-card';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../core/state/cart-store';
import { ToastStore } from '../../../core/state/toast-store';

@Component({
  imports: [ProductCard, RouterLink],
  selector: 'app-wishlist',
  styleUrl: './wishlist.css',
  templateUrl: './wishlist.html',
})
export class Wishlist implements OnInit {
  readonly wishlist = inject(WishlistStore);

  private readonly cart = inject(CartStore);

  private readonly toast = inject(ToastStore);

  ngOnInit(): void {
    void this.wishlist.load();
  }

  async remove(productId: number): Promise<void> {
    try {
      await this.wishlist.remove(productId);

      this.toast.show('Removed from wishlist.');
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'Could not remove product.',
        'error',
      );
    }
  }

  async addToCart(productId: number, productName: string): Promise<void> {
    try {
      await this.cart.add(productId);

      this.toast.show(`${productName} added to cart.`);
    } catch (error) {
      this.toast.show(
        error instanceof Error ? error.message : 'Could not add product to cart.',
        'error',
      );
    }
  }
}
