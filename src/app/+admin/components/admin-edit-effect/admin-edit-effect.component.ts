import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { getCardEffectNameFromType } from '@core/cards/cards.helpers';
import { fadeInOut } from '@shared/animations/component-animations';

import { CardEffectType } from '@core/cards/cards.types';
import { GameEffectActionType, GAME_EFFECTS_MAP } from '@core/game/store/game.effect.actions';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';

@Component({
  selector: 'app-admin-edit-effect',
  templateUrl: './admin-edit-effect.component.html',
  styleUrls: ['./admin-edit-effect.component.scss'],
  animations: [fadeInOut]
})
export class AdminEditEffectComponent {
  @Input() editMode = false;
  @Input() formGroup: FormGroup;
  @Input() open = false;

  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  get effectActionOptions(): SelectControlOption[] {
    let options: SelectControlOption[] = [];

    options = [
      {
        key: '',
        value: 'Select action'
      },
      ...Object.values(GameEffectActionType).map(type => ({
        key: type,
        value: GAME_EFFECTS_MAP[type].name
      }))
    ];

    return options;
  }

  get effectTypeOptions(): SelectControlOption[] {
    let options: SelectControlOption[] = [];

    options = [
      {
        key: '',
        value: 'Select type'
      },
      ...Object.keys(CardEffectType).map(key => ({
        key: CardEffectType[key],
        value: getCardEffectNameFromType(CardEffectType[key])
      }))
    ];

    return options;
  }

  get effectValues(): FormGroup {
    return this.formGroup.controls.values as FormGroup;
  }

  onCancel = (): void => {
    this.cancelled.emit();
  }

  onClose = (): void => {
    this.closed.emit();
  }

  onDelete = (): void => {
    this.deleted.emit();
  }
}
