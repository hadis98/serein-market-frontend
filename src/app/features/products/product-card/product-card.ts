import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Product } from '../../../core/models/product';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../../core/state/cart-store';

@Component({
  imports: [CurrencyPipe, RouterLink],
  selector: 'app-product-card',
  styleUrl: './product-card.css',
  templateUrl: './product-card.html',
})
export class ProductCard {
  readonly product = input.required<Product>();

  readonly cart = inject(CartStore);

  addToCart() {
    console.log("added")
    this.cart.add(this.product());
  }
}
