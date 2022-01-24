import { Component, OnInit } from '@angular/core';
import { AvatarsService } from '@core/avatars/avatars.service';
import { Avatar } from '@core/avatars/avatars.types';

@Component({
  selector: 'app-avatars',
  templateUrl: './avatars.component.html',
  styleUrls: ['./avatars.component.scss']
})
export class AvatarsComponent implements OnInit {
  private idToDelete = '';

  deletePopupOpen: boolean;
  avatars: Avatar[];

  constructor(
    private avatarsSvc: AvatarsService
  ) { }

  ngOnInit(): void {
    this.avatarsSvc.getAvatars().subscribe(avatars => {
      this.avatars = avatars;
    })
  }

  onOpenDeletePopup = (id: string): void => {
    this.deletePopupOpen = true;
    this.idToDelete = id;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
    this.idToDelete = '';
  }

  deleteAvatar = (): void => {
    this.avatarsSvc.deleteAvatar(this.idToDelete, '/admin/avatars');
    this.closeDeletePopup();
  }
}
