import { fader } from '@shared/animations/route-animations'
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  animations: [
    fader
  ]
})
export class AdminComponent {
  prepareRoute = (outlet: RouterOutlet) => {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
