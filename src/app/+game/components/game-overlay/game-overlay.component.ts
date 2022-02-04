import { Component, OnInit } from '@angular/core';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-game-overlay',
  templateUrl: './game-overlay.component.html',
  styleUrls: ['./game-overlay.component.scss'],
  animations: [fadeInOut]
})
export class GameOverlayComponent implements OnInit {
  open = false;

  constructor() { }

  ngOnInit(): void {
  }

}
