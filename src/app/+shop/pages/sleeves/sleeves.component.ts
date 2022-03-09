import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '@core/player/player.service';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { Sleeve } from '@core/sleeves/sleeves.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-sleeves',
  templateUrl: './sleeves.component.html',
  styleUrls: ['./sleeves.component.scss'],
  animations: [fadeInOut]
})
export class SleevesComponent implements OnInit, OnDestroy {
  sleeves: Sleeve[] = [];
  sleevesSub: Subscription;

  constructor(
    private sleevesSvc: SleevesService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.sleevesSub = combineLatest([
      this.sleevesSvc.getSleeves({ visibleInShop: true }),
      this.playerSvc.getOwnedSleevesIds()
    ]).subscribe(([sleeves, ownedIds]) => {
      this.sleeves = sleeves.filter(sleeve => !ownedIds.includes(sleeve.id));
    });
  }

  ngOnDestroy(): void {
    this.sleevesSub.unsubscribe();
  }

  onPurchase = (sleeve: Sleeve): void => {
    this.playerSvc.purchaseSleeve(sleeve);
  }
}
