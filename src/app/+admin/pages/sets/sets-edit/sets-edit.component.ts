import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';

import { SetsService } from '@core/sets/sets.service';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-sets-edit',
  templateUrl: './sets-edit.component.html',
  styleUrls: ['./sets-edit.component.scss'],
  animations: [fadeInOut]
})
export class SetsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;

  constructor(
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    protected route: ActivatedRoute,
    private router: Router,
    private setsSvc: SetsService
  ) {
    super(route);
  }

  get validationMsgs(): string[] {
    const msgs: string[] = [];
    const controls = this.form.controls;
    const imgUrl = controls.imgUrl;

    //#region Check image
    if(!imgUrl.valid && (imgUrl.touched || this.formSubmitted)){
      msgs.push(`Please upload an image.`);
    }
    //#endregion

    return msgs;
  }
  
  init = (): void => {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      imgUrl: new FormControl('', [Validators.required])
    })

    if(this.id){
      this.setsSvc.getSet(this.id).subscribe(set => {
        if(!set){
          this.messageSvc.displayError('This set does not exist.');
      
          this.router.navigate(['/admin/sets']);
        }
  
        if(!set.editable){
          this.messageSvc.displayError('The set with this id is not editable.');
      
          this.router.navigate(['/admin/sets']);
        }

        this.form = new FormGroup({
          name: new FormControl(set.name, [Validators.required]),
          imgUrl: new FormControl(set.imgUrl, [Validators.required])
        })
      })
    }
  }

  onSubmit = (): void => {
    this.formSubmitted = true;

    if(this.form.valid){
      const imgUrl = this.form.get('imgUrl').value;
      const name = this.form.get('name').value;

      if(this.editMode){
        this.setsSvc.updateSet(
          this.id,
          { name, imgUrl }
        );
      } else {
        this.setsSvc.createSet({name, imgUrl});
      }
    } else {
      this.markAllInvalidControls();
      this.messageSvc.displayError('Upload an image and provide the set\'s name.');
    }
  }

  markAllInvalidControls = (): void => {
    const invalidControls: AbstractControl[] = 
      Object.values(this.form.controls)
      .filter(control => !control.valid);

    invalidControls.forEach(control => control.markAsDirty());
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
