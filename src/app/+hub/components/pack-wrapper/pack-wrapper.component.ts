import { Component, Input, OnInit } from '@angular/core';
import { PackWithAmount } from '@app/core/packs/packs.types';
import { PlayerService } from '@app/core/player/player.service';

@Component({
  selector: 'app-pack-wrapper',
  templateUrl: './pack-wrapper.component.html',
  styleUrls: ['./pack-wrapper.component.scss']
})
export class PackWrapperComponent {
  @Input() pack: PackWithAmount;

  constructor(private playerSvc: PlayerService) {}

  open(): void {
    this.playerSvc.openPack(this.pack);
  }
}
