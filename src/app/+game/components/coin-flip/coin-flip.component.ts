import { Component, Input, OnInit } from '@angular/core';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-coin-flip',
  templateUrl: './coin-flip.component.html',
  styleUrls: ['./coin-flip.component.scss'],
  animations: [fadeInOut]
})
export class CoinFlipComponent implements OnInit {
  @Input() open = false;

  constructor() { }

  ngOnInit(): void {
  }

}
