import { Component, OnInit } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'navbar-polania',
  standalone: true,
  imports: [
    MatTabGroup,
    MatTab
  ],
  templateUrl: './navbar-polania.component.html',
  styleUrl: './navbar-polania.component.css'
})
export class NavbarPolaniaComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Establecer la pestaña activa basada en la URL actual
    const currentUrl = this.router.url;
    const tabIndex = this.getTabIndexFromUrl(currentUrl);
    if (tabIndex !== -1) {
      setTimeout(() => {
        const tabGroup = document.querySelector('mat-tab-group') as any;
        if (tabGroup) {
          tabGroup.selectedIndex = tabIndex;
        }
      });
    }
  }

  onTabChange(event: any) {
    const tabIndex = event.index;
    switch (tabIndex) {
      case 0:
        this.router.navigate(['/bolivares']);
        break;
      case 1:
        this.router.navigate(['/bancolombia']);
        break;
      case 2:
        this.router.navigate(['/cajas']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }

  private getTabIndexFromUrl(url: string): number {
    if (url.includes('bolivares')) return 0;
    if (url.includes('bancolombia')) return 1;
    if (url.includes('cajas')) return 2;
    return -1;
  }
}
