import { Component, OnInit } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [MatTabGroup, MatTab, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
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
        this.router.navigate(['bolivares'], { relativeTo: this.route });
        break;
      case 1:
        this.router.navigate(['adicionales'], { relativeTo: this.route });
        break;
      case 2:
        this.router.navigate(['efectivo'], { relativeTo: this.route });
        break;
      default:
        this.router.navigate([''], { relativeTo: this.route });
        break;
    }
  }

  private getTabIndexFromUrl(url: string): number {
    if (url.includes('bolivares')) return 0;
    if (url.includes('adicionales')) return 1;
    if (url.includes('efectivo')) return 2;
    return -1;
  }
}
