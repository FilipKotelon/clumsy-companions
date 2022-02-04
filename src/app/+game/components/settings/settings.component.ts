import { Component, Input, OnInit } from '@angular/core';
import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [fadeInOut]
})
export class SettingsComponent implements OnInit {
  open = false;

  constructor() { }

  ngOnInit(): void {
  }

}
