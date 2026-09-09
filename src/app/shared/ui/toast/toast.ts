import { Component, inject } from '@angular/core';
import { ToastStore } from '../../../core/state/toast-store';

@Component({
  imports: [],
  selector: 'app-toast',
  styleUrl: './toast.css',
  templateUrl: './toast.html',
})
export class Toast {
  readonly toastStore = inject(ToastStore);
}
