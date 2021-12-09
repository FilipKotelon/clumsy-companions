import { NG_VALUE_ACCESSOR } from '@angular/forms'
import { Component, forwardRef, Input } from '@angular/core';
import { InputComponent } from '../../utility/input-component.class';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => LabeledInputComponent),
  multi: true
};

@Component({
  selector: 'app-labeled-input',
  templateUrl: './labeled-input.component.html',
  styleUrls: ['./labeled-input.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class LabeledInputComponent extends InputComponent {
  @Input() type = 'text';
  
  labelUp = false;

  constructor() {
    super()
  }

  onFocus = (): void => {
    this.labelUp = true;
  }

  onFocusOut = (): void => {
    if(!this.value){
      this.labelUp = false;
    }
  }

  override writeValue(value: any): void {
    this.innerValue = value;

    if(this.value){
      this.onFocus();
    }
  }
}
