import { Component, OnInit } from '@angular/core';
import { Avatar } from '@core/avatars/avatars.types';
import { PlayerService } from '@core/player/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  avatars: Avatar[] = [];
  avatarsSub: Subscription;
  initAvatarIndex = 0;

  constructor(private playerSvc: PlayerService) { }

  ngOnInit(): void {
    this.avatarsSub = this.playerSvc.getOwnedAvatars().subscribe(avatars => {
      this.avatars = avatars;
    });
  }

  changeCurrentAvatar = (index: number): void => {
    this.playerSvc.chooseCurrentAvatar(this.avatars[index].id);
  }
}
