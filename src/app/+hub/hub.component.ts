import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GameConnectorService } from '@core/game/game-connector/game-connector.service';
import { fader } from '@shared/animations/route-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.scss'],
  animations: [fader]
})
export class HubComponent implements OnInit {
  gameStartModalOpen = false;
  gameStartModalSub: Subscription;

  constructor(private gameConnectorSvc: GameConnectorService){}

  ngOnInit(): void {
    this.gameStartModalSub = this.gameConnectorSvc.gameStartModalOpen$.subscribe(gameStartModalOpen => {
      this.gameStartModalOpen = gameStartModalOpen;
    });
  }

  prepareRoute = (outlet: RouterOutlet) => {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
