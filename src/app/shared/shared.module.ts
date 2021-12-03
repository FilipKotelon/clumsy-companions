import { LabeledInputComponent } from './components/labeled-input/labeled-input.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    LabeledInputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    LabeledInputComponent,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
