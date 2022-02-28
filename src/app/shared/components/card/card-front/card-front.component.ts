import { Card, CardSize, CardType } from '@core/cards/cards.types';
import { Component, Input, OnInit } from '@angular/core';
import { ObjectLoadReporter } from '@game/utility/object-load-reporter.class';

@Component({
  selector: 'app-card-front',
  templateUrl: './card-front.component.html'
})
export class CardFrontComponent extends ObjectLoadReporter implements OnInit {
  @Input() card: Card;
  @Input() permShowName = false;
  @Input() reportLoad = false;
  @Input() size: CardSize;
  @Input() showEffects: boolean = false;

  allCardTypes = CardType;
  cardEffects: Card[] = [];
  cardLoadId: string;

  ngOnInit(): void {
    if(this.reportLoad){
      this.cardLoadId = this.gameLoaderSvc.registerLoadingObject();
    }
  }
}