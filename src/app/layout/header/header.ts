import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartStore } from '../../core/state/cart-store';
import { AuthStore } from '../../core/auth/auth-store';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  readonly cart = inject(CartStore);
  readonly auth = inject(AuthStore);
}
