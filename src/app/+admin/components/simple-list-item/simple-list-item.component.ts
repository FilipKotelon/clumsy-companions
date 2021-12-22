import { Component, Input } from '@angular/core';
import { ListItemShape } from './simple-list-item.types';

@Component({
  selector: 'app-simple-list-item',
  template: `
    <div class="admin-simple-list-item shape-{{ shape }}">
      <img [src]="imgUrl" [alt]="name" class="admin-simple-list-item__img">
      <div class="admin-simple-list-item__name">
        {{ name }}
      </div>
    </div>
  `,
  styleUrls: ['./simple-list-item.component.scss']
})
export class SimpleListItemComponent {
  @Input() imgUrl: string;
  @Input() name: string;
  @Input() shape: ListItemShape;
}
