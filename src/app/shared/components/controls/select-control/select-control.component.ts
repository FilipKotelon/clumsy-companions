import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputComponent } from '@shared/utility/input-component.class';

import { SelectControlChangeEvent, SelectControlOption } from './select-control.types';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectControlComponent),
  multi: true
};

@Component({
  selector: 'app-select-control',
  templateUrl: './select-control.component.html',
  styleUrls: ['./select-control.component.scss'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class SelectControlComponent extends InputComponent {
  @Input() options: SelectControlOption[] = [];

  isOpen = false;

  constructor() {
    super();
  }

  public override get value(): any {
    if(!this.innerValue){
      if(this.options.length){
        this.innerValue = this.options[0].key;
      } else {
        this.innerValue = null;
      }
    }
    return this.innerValue;
  }

  override set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
    }
  }

  selectValue = (e: Event, key) => {
    this.value = key;
    this.isOpen = false;
    
    this.onChange(e, key);
  }
  
  openSelect = () => {
    this.isOpen = true;
  }

}
