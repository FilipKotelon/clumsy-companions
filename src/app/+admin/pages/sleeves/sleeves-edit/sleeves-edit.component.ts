import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { SleeveMainData } from '@core/sleeves/sleeves.types';

@Component({
  selector: 'app-sleeves-edit',
  templateUrl: './sleeves-edit.component.html',
  styleUrls: ['./sleeves-edit.component.scss']
})
export class SleevesEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;

  constructor(
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    protected route: ActivatedRoute,
    private router: Router,
    private sleevesSvc: SleevesService
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
      this.sleevesSvc.getSleeve(this.id).subscribe(sleeve => {
        if(!sleeve){
          this.messageSvc.displayError('This sleeve does not exist.');
      
          this.router.navigate(['/admin/sleeves']);
        }

        this.form = new FormGroup({
          name: new FormControl(sleeve.name, [Validators.required]),
          imgUrl: new FormControl(sleeve.imgUrl, [Validators.required]),
          price: new FormControl(sleeve.price, [Validators.required]),
          visibleInShop: new FormControl(sleeve.visibleInShop)
        })
      })
    }
  }

  onSubmit = (): void => {
    this.formSubmitted = true;

    if(this.form.valid){
      const sleeveData = this.getSleeveDataFromControls();

      if(this.editMode){
        this.sleevesSvc.updateSleeve(
          this.id,
          sleeveData
        );
      } else {
        this.sleevesSvc.createSleeve(sleeveData);
      }
    } else {
      this.markAllInvalidControls();
      this.messageSvc.displayError('Please fill out all of the fields.');
    }
  }

  getSleeveDataFromControls = (): SleeveMainData => {
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

  deleteSleeve = (): void => {
    this.sleevesSvc.deleteSleeve(this.id, '/admin/sleeves');
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
  
      this.router.navigate(['/admin/sleeves']);
    }
  }

  onImgUpload = (): void => {
    if(this.editMode){
      const sleeveData = this.getSleeveDataFromControls();

      this.sleevesSvc.updateSleeve(
        this.id,
        sleeveData
      )
    }
  }
}
