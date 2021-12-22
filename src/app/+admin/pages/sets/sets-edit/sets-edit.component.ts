import { Set } from '@core/sets/sets.types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { SetsService } from '@core/sets/sets.service';

@Component({
  selector: 'app-sets-edit',
  templateUrl: './sets-edit.component.html',
  styleUrls: ['./sets-edit.component.scss']
})
export class SetsEditComponent extends EditableOrNew {
  form: FormGroup;
  set: Set;

  constructor(
    protected route: ActivatedRoute,
    private setsService: SetsService
  ) {
    super(route);
  }
  
  initForm = (): void => {
    let name = '',
      imgUrl = '';

    this.form = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      imgUrl: new FormControl(imgUrl, [Validators.required])
    })

    if(this.id){
      this.setsService.getSet(this.id).subscribe(set => {
        this.set = set;

        this.form = new FormGroup({
          name: new FormControl(set.name, [Validators.required]),
          imgUrl: new FormControl(set.imgUrl, [Validators.required])
        })
  
        if(!set.editable){
          this.setsService.redirectOnUneditableSet();
        }
      })
    }
  }

  onSubmit = (): void => {
    if(this.form.valid){

    } else {
      this.setsService.handleValidationError();
    }

    console.log(this.form);
  }
}
