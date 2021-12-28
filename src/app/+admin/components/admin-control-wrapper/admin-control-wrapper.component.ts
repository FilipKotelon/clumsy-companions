import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-control-wrapper',
  templateUrl: './admin-control-wrapper.component.html',
  styleUrls: ['./admin-control-wrapper.component.scss']
})
export class AdminControlWrapperComponent {
  @Input() label: string;
  @Input() validationMessage: string;
  @Input() control: FormControl;
}
