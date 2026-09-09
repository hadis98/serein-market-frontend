import { Injectable, signal } from '@angular/core';
export type ToastType = 'success' | 'error' | 'info';
export interface Toast {
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastStore {
  private readonly toastState = signal<Toast | null>(null);
  readonly toast = this.toastState.asReadonly();

  private timeoutId?: ReturnType<typeof setTimeout>;
  show(message: string, type: ToastType = 'success') {
    this.toastState.set({
      message,
      type,
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.hide();
    }, 3000);
  }

  hide() {
    this.toastState.set(null);
  }
}
