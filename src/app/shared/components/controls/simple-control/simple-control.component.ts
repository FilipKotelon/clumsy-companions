import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from '@app/shared/utility/input-component.class';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SimpleControlComponent),
  multi: true
};

@Component({
  selector: 'app-simple-control',
  templateUrl: './simple-control.component.html',
  styleUrls: ['./simple-control.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SimpleControlComponent extends InputComponent {
  @Input() type = 'text';

  constructor() {
    super();
  }
}
