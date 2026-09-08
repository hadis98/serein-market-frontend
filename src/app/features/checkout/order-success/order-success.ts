import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-success',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './order-success.html',
  styleUrl: './order-success.css',
})
export class OrderSuccess {
  readonly total = Number(history.state?.total ?? 0);
}
