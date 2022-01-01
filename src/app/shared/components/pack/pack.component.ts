import { Component, Input } from '@angular/core';
import { Pack } from '@core/packs/packs.types';

@Component({
  selector: 'app-pack',
  templateUrl: './pack.component.html',
  styleUrls: ['./pack.component.scss']
})
export class PackComponent {
  @Input() pack: Pack;
}
