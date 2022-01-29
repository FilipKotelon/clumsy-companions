import { OnChanges, AfterViewInit, Input, ElementRef, ViewChild, Directive } from '@angular/core';
import { ControlValueAccessor, FormControl } from '@angular/forms';

@Directive()
export abstract class InputComponent implements ControlValueAccessor, OnChanges, AfterViewInit {
  @Input() label: string;
  @Input() validationMessage: string;
  @Input() formControlName: string;
  @Input() control:FormControl = new FormControl(); 

  @ViewChild('input') inputRef:ElementRef; 

  innerValue = null;

  constructor() { }

  ngOnChanges(): void { }

  ngAfterViewInit(): void { 
    // RESET the custom input form control UI when the form control is RESET
    this.control.valueChanges.subscribe(
      () => {
        // check condition if the form control is RESET
        if (this.control.value === '' || this.control.value === null || this.control.value === undefined) {
          this.innerValue = '';

          if(this.inputRef){
            this.inputRef.nativeElement.value = '';
          }
        }
      }
    );
  }

  //get accessor
  public get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
    }
  }

  // event fired when input value is changed . later propagated up to the form control using the custom value accessor interface
  onChange(e:Event, value:any): void {
    //set changed value
    this.innerValue = value;
    // propagate value into form control using control value accessor interface
    this.propagateChange(this.innerValue);
  }

  //propagate changes into the custom form control
  propagateChange = (_: any): void => { }

  //From ControlValueAccessor interface
  writeValue(value: any): void {
    this.innerValue = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any): void { }

}
