import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Icon } from '../../shared/ui/icon/icon';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Icon],
  selector: 'app-admin-layout',
  styleUrl: './admin-layout.css',
  templateUrl: './admin-layout.html',
})
export class AdminLayout {
  readonly mobileNavOpen = signal(false);

  openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  closeMobileNav(): void {
    this.mobileNavOpen.set(false);
  }
}
