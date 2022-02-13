import { Component, Input, OnInit } from '@angular/core';
import { CardInPlay } from '@core/game/game.types';

@Component({
  selector: 'app-cards-in-play',
  templateUrl: './cards-in-play.component.html',
  styleUrls: ['./cards-in-play.component.scss']
})
export class CardsInPlayComponent implements OnInit {
  @Input() cards: CardInPlay[] = [];
  @Input() sleeveImgUrl: string;

  constructor() { }

  ngOnInit(): void {
  }

}
