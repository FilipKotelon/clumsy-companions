import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarsService } from '@core/avatars/avatars.service';
import { AvatarMainData } from '@core/avatars/avatars.types';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

@Component({
  selector: 'app-avatars-edit',
  templateUrl: './avatars-edit.component.html',
  styleUrls: ['./avatars-edit.component.scss']
})
export class AvatarsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;

  constructor(
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    protected route: ActivatedRoute,
    private router: Router,
    private avatarsSvc: AvatarsService
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
      imgUrl: new FormControl('', [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      visibleInShop: new FormControl(true)
    })

    if(this.id){
      this.avatarsSvc.getAvatar(this.id).subscribe(avatar => {
        if(!avatar){
          this.messageSvc.displayError('This avatar does not exist.');
      
          this.router.navigate(['/admin/avatars']);
        }

        this.form = new FormGroup({
          name: new FormControl(avatar.name, [Validators.required]),
          imgUrl: new FormControl(avatar.imgUrl, [Validators.required]),
          price: new FormControl(avatar.price, [Validators.required]),
          visibleInShop: new FormControl(avatar.visibleInShop)
        })
      })
    }
  }

  onSubmit = (): void => {
    this.formSubmitted = true;

    if(this.form.valid){
      const avatarData = this.getAvatarDataFromControls();

      if(this.editMode){
        this.avatarsSvc.updateAvatar(
          this.id,
          avatarData
        );
      } else {
        this.avatarsSvc.createAvatar(avatarData);
      }
    } else {
      this.markAllInvalidControls();
      this.messageSvc.displayError('Please fill out all of the fields.');
    }
  }

  getAvatarDataFromControls = (): AvatarMainData => {
    const name = this.form.get('name').value;
    const imgUrl = this.form.get('imgUrl').value;
    const price = +this.form.get('price').value;
    const visibleInShop = this.form.get('visibleInShop').value;

    return {
      name,
      imgUrl,
      price,
      visibleInShop
    };
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

  deleteAvatar = (): void => {
    this.avatarsSvc.deleteAvatar(this.id, '/admin/avatars');
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
  
      this.router.navigate(['/admin/avatars']);
    }
  }

  onImgUpload = (): void => {
    if(this.editMode){
      const avatarData = this.getAvatarDataFromControls();

      this.avatarsSvc.updateAvatar(
        this.id,
        avatarData
      )
    }
  }
}
