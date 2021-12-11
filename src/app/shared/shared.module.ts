import { InfoMessageComponent } from './components/info-message/info-message.component'
import { ErrorMessageComponent } from './components/error-message/error-message.component'
import { AcceptPopupComponent } from './components/accept-popup/accept-popup.component'
import { PopupMessageComponent } from './components/popup-message/popup-message.component'
import { LabeledInputComponent } from './components/labeled-input/labeled-input.component'
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { BigNumberPipe } from './pipes/big-number.pipe';
import { CardComponent } from './components/card/card.component';
import { CardFrontComponent } from './components/card/card-front/card-front.component';



@NgModule({
  declarations: [
    LabeledInputComponent,
    PopupMessageComponent,
    AcceptPopupComponent,
    ErrorMessageComponent,
    InfoMessageComponent,
    LoadingModalComponent,
    BigNumberPipe,
    CardComponent,
    CardFrontComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LabeledInputComponent,
    PopupMessageComponent,
    AcceptPopupComponent,
    ErrorMessageComponent,
    InfoMessageComponent,
    LoadingModalComponent,
    BigNumberPipe,
  ]
})
export class SharedModule { }
