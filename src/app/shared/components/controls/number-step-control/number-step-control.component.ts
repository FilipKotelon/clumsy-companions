import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputComponent } from '@shared/utility/input-component.class';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NumberStepControlComponent),
  multi: true
};

@Component({
  selector: 'app-number-step-control',
  templateUrl: './number-step-control.component.html',
  styleUrls: ['./number-step-control.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class NumberStepControlComponent extends InputComponent {
  @Input() min = 1;
  @Input() max = 99;

  constructor() {
    super();
  }

  decreaseValue = (e: Event): void => {
    if(this.value - 1 >= this.min){
      this.value--;

      this.onChange(e, this.value);
    }
  }

  increaseValue = (e: Event): void => {
    if(this.value + 1 <= this.max){
      this.value++;

      this.onChange(e, this.value);
    }
  }
  
}
