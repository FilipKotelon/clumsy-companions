import { Component, OnDestroy, OnInit } from '@angular/core';
import { AvatarsService } from '@core/avatars/avatars.service';
import { Avatar } from '@core/avatars/avatars.types';
import { PlayerService } from '@core/player/player.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { combineLatest, Subscription } from 'rxjs';

@Component({
  selector: 'app-avatars',
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss'],
  animations: [fadeInOut]
})
export class AvatarsComponent implements OnInit, OnDestroy {
  avatars: Avatar[] = [];
  avatarsSub: Subscription;

  constructor(
    private avatarsSvc: AvatarsService,
    private playerSvc: PlayerService
  ) { }

  ngOnInit(): void {
    this.avatarsSub = combineLatest([
      this.avatarsSvc.getAvatars(),
      this.playerSvc.getOwnedAvatarsIds()
    ]).subscribe(([avatars, ownedIds]) => {
      this.avatars = avatars.filter(avatar => !ownedIds.includes(avatar.id));
    });
  }

  ngOnDestroy(): void {
    this.avatarsSub.unsubscribe();
  }

  onPurchase = (avatar: Avatar): void => {
    this.playerSvc.purchaseAvatar(avatar);
  }
}
