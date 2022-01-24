import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InfoMessageComponent } from './components/info-message/info-message.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { AcceptPopupComponent } from './components/accept-popup/accept-popup.component';
import { PopupMessageComponent } from './components/popup-message/popup-message.component';
import { LabeledInputComponent } from './components/labeled-input/labeled-input.component';
import { LoadingModalComponent } from './components/loading-modal/loading-modal.component';
import { CardFrontComponent } from './components/card/card-front/card-front.component';
import { CardSleeveComponent } from './components/card/card-sleeve/card-sleeve.component';
import { CardEffectComponent } from './components/card/card-effect/card-effect.component';
import { ToggleControlComponent } from './components/controls/toggle-control/toggle-control.component';
import { SelectControlComponent } from './components/controls/select-control/select-control.component';
import { SimpleControlComponent } from './components/controls/simple-control/simple-control.component';
import { BigNumberPipe } from './pipes/big-number/big-number.pipe';
import { PackComponent } from './components/pack/pack.component';
import { NumberStepControlComponent } from './components/controls/number-step-control/number-step-control.component';
import { GiftModalComponent } from './components/gift-modal/gift-modal.component';
import { DeckComponent } from './components/deck/deck.component';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  declarations: [
    LabeledInputComponent,
    PopupMessageComponent,
    AcceptPopupComponent,
    ErrorMessageComponent,
    InfoMessageComponent,
    LoadingModalComponent,
    BigNumberPipe,
    CardFrontComponent,
    CardSleeveComponent,
    CardEffectComponent,
    ToggleControlComponent,
    SelectControlComponent,
    SimpleControlComponent,
    PackComponent,
    NumberStepControlComponent,
    GiftModalComponent,
    DeckComponent,
    AvatarComponent,
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
    CardFrontComponent,
    CardSleeveComponent,
    CardEffectComponent,
    ToggleControlComponent,
    SelectControlComponent,
    SimpleControlComponent,
    PackComponent,
    NumberStepControlComponent,
    GiftModalComponent,
    DeckComponent,
    AvatarComponent
  ]
})
export class SharedModule { }
