import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Toast } from './shared/ui/toast/toast';

@Component({
  imports: [RouterOutlet, Header, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('e-commerce-clothes-shop');
}
