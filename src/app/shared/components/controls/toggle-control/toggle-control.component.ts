import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputComponent } from '@shared/utility/input-component.class';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ToggleControlComponent),
  multi: true
};

@Component({
  selector: 'app-toggle-control',
  templateUrl: './toggle-control.component.html',
  styleUrls: ['./toggle-control.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ToggleControlComponent extends InputComponent {
  constructor() {
    super();
  }
}
