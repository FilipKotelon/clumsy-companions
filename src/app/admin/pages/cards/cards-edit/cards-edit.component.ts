import { CardEffect } from '@core/cards/cards.types';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EditableOrNew } from '@app/admin/utility/editable-or-new.class';

@Component({
  selector: 'app-cards-edit',
  templateUrl: './cards-edit.component.html',
  styleUrls: ['./cards-edit.component.scss']
})
export class CardsEditComponent extends EditableOrNew {
  form: FormGroup;
  
  constructor(protected route: ActivatedRoute) {
    super(route);
  }

  initForm = (): void => {
    let type = '',
      set = '',
      name = '',
      imgUrl = '',
      cost: number = null,
      strength: number = null,
      energy: number = null,
      effects: CardEffect[] = [],
      dateAdded: Date = null;
  }

  onSubmit = (): void => {
    
  }

}
