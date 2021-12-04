import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { fader } from '@app/shared/animations/route-animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    fader
  ]
})
export class HomeComponent {
  prepareRoute(outlet: RouterOutlet){
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
