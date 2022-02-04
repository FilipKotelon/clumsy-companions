import { Component, Input, OnInit } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { ObjectLoadReporter } from '@game/utility/object-load-reporter.class';

@Component({
  selector: 'app-card-sleeve',
  template: `
    <div class="card-sleeve">
      <img
        [src]="sleeveImgUrl"
        alt="Card Sleeve"
        class="card-sleeve__img"
        (load)="reportLoad ? reportLoadedObject(sleeveLoadId) : null"
      >
    </div>
  `
})
export class CardSleeveComponent extends ObjectLoadReporter implements OnInit {
  @Input() reportLoad = false;
  @Input() sleeveImgUrl: string;

  sleeveLoadId: string;

  ngOnInit(): void {
    if(this.reportLoad){
      this.sleeveLoadId = this.gameLoaderSvc.registerLoadingObject();
    }
  }
}
