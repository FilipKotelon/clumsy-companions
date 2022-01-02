import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';
import { PackMainData } from '@core/packs/packs.types';
import { PacksService } from '@core/packs/packs.service';
import { SetsService } from '@core/sets/sets.service';

import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { fadeInOut } from '@shared/animations/component-animations';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';

@Component({
  selector: 'app-packs-edit',
  templateUrl: './packs-edit.component.html',
  styleUrls: ['./packs-edit.component.scss'],
  animations: [fadeInOut]
})
export class PacksEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;
  setOptions: SelectControlOption[] = [];

  constructor(
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    private packsSvc: PacksService,
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
      imgUrl: new FormControl('', [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      setId: new FormControl('', [Validators.required, this.validateIsSetId]),
      visibleInShop: new FormControl(true)
    })

    this.setsSvc.getSetSelectOptions().subscribe(setOptions => {
      this.setOptions = setOptions;

      if(this.id){
        this.packsSvc.getPack(this.id).subscribe(pack => {
          if(!pack){
            this.messageSvc.displayError('This pack does not exist.');
        
            this.router.navigate(['/admin/packs']);
          }
  
          this.form = new FormGroup({
            name: new FormControl(pack.name, [Validators.required]),
            imgUrl: new FormControl(pack.imgUrl, [Validators.required]),
            price: new FormControl(pack.price, [Validators.required]),
            setId: new FormControl(pack.setId, [Validators.required, this.validateIsSetId]),
            visibleInShop: new FormControl(pack.visibleInShop)
          })
        })
      }
    })
  }

  onSubmit = (): void => {
    this.formSubmitted = true;

    if(this.form.valid){
      const packData = this.getPackDataFromControls();

      if(this.editMode){
        this.packsSvc.updatePack(
          this.id,
          packData
        );
      } else {
        this.packsSvc.createPack(packData);
      }
    } else {
      this.markAllInvalidControls();
      this.messageSvc.displayError('Please fill out all of the fields.');
    }
  }

  getPackDataFromControls = (): PackMainData => {
    const name = this.form.get('name').value;
    const imgUrl = this.form.get('imgUrl').value;
    const price = +this.form.get('price').value;
    const setId = this.form.get('setId').value;
    const visibleInShop = this.form.get('visibleInShop').value;

    return {
      name,
      imgUrl,
      price,
      setId,
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

  deletePack = (): void => {
    this.packsSvc.deletePack(this.id, '/admin/packs');
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
  
      this.router.navigate(['/admin/packs']);
    }
  }

  onImgUpload = (): void => {
    if(this.editMode){
      const packData = this.getPackDataFromControls();

      this.packsSvc.updatePack(
        this.id,
        packData
      )
    }
  }

  validateIsSetId = (control: FormControl): ValidationErrors => {
    const foundSet = !!this.setOptions.find(set => ((set.key === control.value) && set.key));

    if(!foundSet){
      return {'setIdIsIncorrect': true};
    }
    return null;
  }
}
