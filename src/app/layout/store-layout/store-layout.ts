import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../header/header';

@Component({
  imports: [RouterOutlet, Header],
  selector: 'app-store-layout',
  styleUrl: './store-layout.css',
  templateUrl: './store-layout.html',
})
export class StoreLayout {}
