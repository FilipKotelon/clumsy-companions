import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { fader } from '@shared/animations/route-animations';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  animations: [fader]
})
export class ShopComponent {
  prepareRoute = (outlet: RouterOutlet) => {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
