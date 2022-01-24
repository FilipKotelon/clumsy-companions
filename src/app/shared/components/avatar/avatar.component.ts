import { Component, Input } from '@angular/core';
import { Avatar } from '@core/avatars/avatars.types';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  @Input() avatar: Avatar;
}
