import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableOrNew } from '@app/admin/utility/editable-or-new.class';

@Component({
  selector: 'app-cards-edit',
  templateUrl: './cards-edit.component.html',
  styleUrls: ['./cards-edit.component.scss']
})
export class CardsEditComponent extends EditableOrNew {
  
  constructor(protected route: ActivatedRoute) {
    super(route);
  }

  initForm = (): void => {

  }

  onSubmit = (): void => {
    
  }

}
