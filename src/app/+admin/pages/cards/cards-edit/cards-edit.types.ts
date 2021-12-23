import { FormGroup } from '@angular/forms';
import { CardEffect } from '@core/cards/cards.types';

export interface CardEffectFormGroup {
  formGroup: FormGroup;
  effect: CardEffect;
}