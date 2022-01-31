import { Component } from '@angular/core';
import { GameConnectorService } from '@core/game/game-connector/game-connector.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private gameConnectorSvc: GameConnectorService) { }
  
  openGameStartModal = (): void => {
    this.gameConnectorSvc.openGameStartModal();
  }
}
