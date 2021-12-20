import { fadeInOut } from './../animations/component-animations';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss'],
  animations: [
    fadeInOut
  ]
})
export class LoadingModalComponent {
  @Input() open: boolean;
  @Input() global = false;
}
