import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-collection-wrapper',
  templateUrl: './collection-wrapper.component.html',
  styleUrls: ['./collection-wrapper.component.scss']
})
export class CollectionWrapperComponent {
  @Output() opened = new EventEmitter<void>();

  open = (): void => {
    this.opened.emit();
  }
}
