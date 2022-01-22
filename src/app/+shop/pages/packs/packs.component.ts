import { Component, OnInit } from '@angular/core';

import { Pack } from '@core/packs/packs.types';
import { PacksService } from '@core/packs/packs.service';
import { PlayerService } from '@core/player/player.service';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {
  packs: Pack[];

  constructor(
    private packsSvc: PacksService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.packsSvc.getPacks().subscribe(packs => {
      this.packs = packs;
    })
  }

  onPurchase = (amount: number, pack: Pack): void => {
    this.playerSvc.purchasePack(pack, amount);
  }
}
