import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hand',
  templateUrl: './hand.component.html',
  styleUrls: ['./hand.component.scss']
})
export class HandComponent implements OnInit {
  @Input() flipped = false;

  constructor() { }

  ngOnInit(): void {
  }

}
