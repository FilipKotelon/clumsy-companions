import { FormGroup } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableOrNew } from '@admin/utility/editable-or-new.class';

@Component({
  selector: 'app-sets-edit',
  templateUrl: './sets-edit.component.html',
  styleUrls: ['./sets-edit.component.scss']
})
export class SetsEditComponent extends EditableOrNew {
  form: FormGroup;

  constructor(protected route: ActivatedRoute) {
    super(route);
  }
  
  initForm = (): void => {
    let name = '',
      imgUrl = '',
      dateAdded: Date = null;
  }

  onSubmit = (): void => {

  }
}
