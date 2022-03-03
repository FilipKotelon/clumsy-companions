import { Component, OnInit } from '@angular/core';
import { GameMessagesService } from '@core/game/game-messages/game-messages.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-game-messages',
  templateUrl: './game-messages.component.html',
  styleUrls: ['./game-messages.component.scss'],
  animations: [fadeInOut]
})
export class GameMessagesComponent implements OnInit {
  msg: string;
  msgSub: Subscription;

  constructor(private gameMessagesSvc: GameMessagesService) { }

  ngOnInit(): void {
    this.msgSub = this.gameMessagesSvc.message$.subscribe(msg => {
      this.msg = msg;
    });
  }
}
