import { Set } from '@core/sets/sets.types';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { SetsService } from '@core/sets/sets.service';
import { FilesService } from '@app/core/files/files.service';

@Component({
  selector: 'app-sets-edit',
  templateUrl: './sets-edit.component.html',
  styleUrls: ['./sets-edit.component.scss']
})
export class SetsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;

  constructor(
    private filesSvc: FilesService,
    protected route: ActivatedRoute,
    private router: Router,
    private setsSvc: SetsService,
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
      this.setsSvc.getSet(this.id).subscribe(set => {
        if(!set){
          this.setsSvc.redirectOnNoSet();
        }
  
        if(!set.editable){
          this.setsSvc.redirectOnUneditableSet();
        }

        this.form = new FormGroup({
          name: new FormControl(set.name, [Validators.required]),
          imgUrl: new FormControl(set.imgUrl, [Validators.required])
        })
      })
    }
  }

  onSubmit = (): void => {
    if(this.form.valid){
      const imgUrl = this.form.get('imgUrl').value;
      const name = this.form.get('name').value;

      if(this.editMode){
        this.setsSvc.updateSet(
          this.id,
          { name, imgUrl }
        );
      } else {
        this.setsSvc.createSet(name, imgUrl);
      }
    } else {
      this.setsSvc.handleValidationError();
    }
  }

  onOpenDeletePopup = (): void => {
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteSet = (): void => {
    this.setsSvc.deleteSet(this.id, '/admin/sets');
    this.closeDeletePopup();
  }

  onOpenCancelPopup = (): void => {
    if(this.form.pristine){
      this.cancel();
    } else {
      this.cancelPopupOpen = true;
    }
  }

  closeCancelPopup = (): void => {
    this.cancelPopupOpen = false;
  }

  cancel = (): void => {
    if(!this.editMode){
      const imgUrl = this.form.get('imgUrl').value;
  
      if(imgUrl) {
        this.filesSvc.deleteFile(imgUrl);
      }
  
      this.router.navigate(['/admin/sets']);
    }
  }

  onImgUpload = (): void => {
    if(this.editMode){
      const imgUrl = this.form.get('imgUrl').value;
      const name = this.form.get('name').value;

      this.setsSvc.updateSet(
        this.id,
        {name, imgUrl}
      )
    }
  }
}
