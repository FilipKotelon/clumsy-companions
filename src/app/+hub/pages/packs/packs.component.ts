import { Component, OnInit } from '@angular/core';

import { PlayerService } from '@core/player/player.service';
import { PacksService } from '@core/packs/packs.service';
import { PackWithAmount } from '@core/packs/packs.types';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {
  packs: PackWithAmount[];

  constructor(
    private packsSvc: PacksService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.playerSvc.getOwnedPacks().subscribe(packs => {
      this.packs = packs;
    });
  }
}
