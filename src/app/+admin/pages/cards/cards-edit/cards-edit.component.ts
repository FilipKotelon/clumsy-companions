import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { CardEffect, CardEffectType, CardType } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { GameEffectActionType } from '@core/game/store/game.effect.actions';
import { FilesService } from '@core/files/files.service';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';

import { CardEffectFormGroup } from './cards-edit.types';

@Component({
  selector: 'app-cards-edit',
  templateUrl: './cards-edit.component.html',
  styleUrls: ['./cards-edit.component.scss']
})
export class CardsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  cardEffectGroups: CardEffectFormGroup[] = [];
  cardEffectsSub: Subscription;
  deletePopupOpen: boolean;
  form: FormGroup;
  
  constructor(
    private cardsSvc: CardsService,
    private filesSvc: FilesService,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    super(route);
  }

  initForm = (): void => {
    this.form = new FormGroup({
      type: new FormControl('', [Validators.required, this.validateCardType]),
      setId: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      imgUrl: new FormControl('', [Validators.required]),
      cost: new FormControl(null, [Validators.required, Validators.min(1)]),
      strength: new FormControl(null, [Validators.required, Validators.min(0)]),
      energy: new FormControl(null, [Validators.required, Validators.min(1)]),
      effects: new FormArray([])
    });

    this.cardEffectsSub = (<FormArray>this.form.get('effects')).valueChanges.subscribe(() => {
      this.cardEffectGroups = this.getEffectFormGroups();
    })

    if(this.id){
      this.cardsSvc.getCard(this.id).subscribe(card => {
        this.form = new FormGroup({
          type: new FormControl(card.type, [Validators.required, this.validateCardType]),
          setId: new FormControl(card.setId, [Validators.required]),
          name: new FormControl(card.name, [Validators.required]),
          imgUrl: new FormControl(card.imgUrl, [Validators.required]),
          cost: new FormControl(card.cost, [Validators.required, Validators.min(1)]),
          strength: new FormControl(card.strength, [Validators.required, Validators.min(0)]),
          energy: new FormControl(card.energy, [Validators.required, Validators.min(1)]),
          effects: new FormArray(card.effects.map(effect => new FormGroup({

              name: new FormControl(effect.name, [Validators.required]),
              description: new FormControl(effect.description, [Validators.required]),
              type: new FormControl(effect.type, [Validators.required, this.validateCardEffectType]),
              action: new FormControl(effect.action, [Validators.required, this.validateCardEffectAction]),
              values: new FormGroup({
                main: new FormControl(effect.values.main),
                energy: new FormControl(effect.values.energy),
                strength: new FormControl(effect.values.strength)
              }),
              phase: new FormControl(effect.phase)

            })
          ))
        });

        this.cardEffectGroups = this.getEffectFormGroups();

        this.cardEffectsSub = (<FormArray>this.form.get('effects')).valueChanges.subscribe(() => {
          this.cardEffectGroups = this.getEffectFormGroups();
        })
      });
    }
  }

  onSubmit = (): void => {
    
  }

  getEffectFormGroups = (): CardEffectFormGroup[] => {
    return (<FormGroup[]>(<FormArray>this.form.get('effects')).controls).map(formGroup => {
      return {
        formGroup,
        effect: this.getEffectFromFormGroup(formGroup)
      }
    });
  }

  getEffectFromFormGroup = (formGroup: FormGroup): CardEffect => {
    return {
      name: formGroup.get('name').value,
      description: formGroup.get('description').value,
      type: formGroup.get('type').value,
      action: formGroup.get('action').value,
      values: {
        main: (<FormGroup>formGroup.get('values')).get('main').value,
        energy: (<FormGroup>formGroup.get('values')).get('energy').value,
        strength: (<FormGroup>formGroup.get('values')).get('strength').value
      },
      phase: formGroup.get('phase').value,
    }
  }

  validateCardType = (control: FormControl): ValidationErrors => {
    if(!Object.values(CardEffectType).includes(control.value)){
      return {'effectTypeIncorrect': true}
    }
    return null;
  }

  validateCardEffectAction = (control: FormControl): ValidationErrors => {
    if(control.value as GameEffectActionType){
      return {'cardTypeIncorrect': true}
    }
    return null;
  }

  validateCardEffectType = (control: FormControl): ValidationErrors => {
    if(!Object.values(CardType).includes(control.value)){
      return {'cardTypeIncorrect': true}
    }
    return null;
  }

  onOpenDeletePopup = (): void => {
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteSet = (): void => {
    this.cardsSvc.deleteCard(this.id, '/admin/sets');
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

  // onImgUpload = (): void => {
  //   if(this.editMode){
  //     const imgUrl = this.form.get('imgUrl').value;
  //     const name = this.form.get('name').value;

  //     this.setsSvc.updateSet(
  //       this.id,
  //       {name, imgUrl}
  //     )
  //   }
  // }
}
