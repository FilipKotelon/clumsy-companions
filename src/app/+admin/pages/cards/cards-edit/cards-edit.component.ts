import { TitleCasePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Card, CardEffect, CardEffectType, CardMainData, CardType, CARD_SETTINGS } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { FilesService } from '@core/files/files.service';
import { GameEffectActionType } from '@core/game/store/game.effect.actions';
import { MessageService } from '@core/message/message.service';
import { Set } from '@core/sets/sets.types';
import { SetsService } from '@core/sets/sets.service';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';

import { CardEffectFormGroup } from './cards-edit.types';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';

import { fadeInOut } from '@shared/animations/component-animations';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-cards-edit',
  templateUrl: './cards-edit.component.html',
  styleUrls: ['./cards-edit.component.scss'],
  providers: [TitleCasePipe],
  animations: [fadeInOut]
})
export class CardsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  cardEffectGroups: CardEffectFormGroup[] = [];
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;
  newCardEffectForm: FormGroup;
  newCardEffectFormOpen: boolean;
  setOptions: SelectControlOption[] = [];

  @ViewChild('controls') controlsContainer: ElementRef;
  
  constructor(
    private cardsSvc: CardsService,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    protected route: ActivatedRoute,
    private router: Router,
    private setsSvc: SetsService,
    private titleCasePipe: TitleCasePipe
  ) {
    super(route);
  }

  //#region Getters
  get areControlsOverflowing(): boolean {
    if(this.controlsContainer){
      const controlsEl = this.controlsContainer.nativeElement as HTMLElement;
  
      return controlsEl.clientHeight < controlsEl.scrollHeight;
    }

    return false;
  }

  get canAddMoreEffects(): boolean {
    if(this.cardType === CardType.Food) {
      return false;
    } else if(this.cardType === CardType.Charm || this.cardType === CardType.Trick) {
      return this.getEffectFormGroups().length < 1;
    } else if(this.cardType === CardType.Companion) {
      return this.getEffectFormGroups().length < 2;
    }

    return false;
  }

  get canSubmit(): boolean {
    if(this.form.valid){
      return true;
    } else {
      const invalidControls = [...this.invalidControlNames];
      const crucialControls = invalidControls.filter(controlName => !this.canIgnoreInvalidControl(controlName));

      //Check if, after ignoring controls you don't need, there are any crucial invalid controls left, which block submitting
      return !crucialControls.length;
    }
  }

  get cardName(): string {
    return this.form.controls.name.value;
  }

  get cardType(): CardType {
    return this.form.controls.type.value;
  }

  get cardTypeOptions(): SelectControlOption[] {
    let options: SelectControlOption[] = [];

    options = [
      {
        key: '',
        value: 'Select type'
      },
      ...Object.keys(CardType).map(key => ({
        key: CardType[key],
        value: this.titleCasePipe.transform(CardType[key])
      }))
    ];

    return options;
  }

  get invalidControlNames(): string[] {
    const controls: string[] = [];

    for(let name in this.form.controls){
      if(!this.form.controls[name].valid){
        controls.push(name);
      }
    }

    return controls;
  }

  get isCompanion(): boolean {
    return this.cardType === CardType.Companion;
  }

  get isCharm(): boolean {
    return this.cardType === CardType.Charm;
  }

  get isFood(): boolean {
    return this.cardType === CardType.Food;
  }

  get isTrick(): boolean {
    return this.cardType === CardType.Trick;
  }

  get isCharmOrTrick(): boolean {
    return this.isCharm || this.isTrick;
  }

  get shouldHaveEffects(): boolean {
    return !this.isFood;
  }

  get shouldHaveCost(): boolean {
    return !this.isFood;
  }

  get shouldHaveStrengthAndEnergy(): boolean {
    return this.isCompanion;
  }

  get showFinalLook(): boolean {
    return this.form.controls.showFinalLook.value as boolean;
  }

  get validationMsgs(): string[] {
    const msgs: string[] = [];
    const controls = this.form.controls;

    const cost = controls.cost;
    const strength = controls.strength;
    const energy = controls.energy;
    const imgUrl = controls.imgUrl;
    const effects = (<FormArray>controls.effects);

    //#region Check cost, strength and energy
    if(!cost.valid && (cost.touched || this.formSubmitted) && !this.isFood){
      msgs.push(`Please provide the card's cost (an integer between ${CARD_SETTINGS.MIN_COST} and ${CARD_SETTINGS.MAX_COST}).`);
    }

    if(!strength.valid && (strength.touched || this.formSubmitted) && this.isCompanion){
      msgs.push(`Please provide the card's strength (an integer between ${CARD_SETTINGS.MIN_STRENGTH} and ${CARD_SETTINGS.MAX_STRENGTH}).`);
    }

    if(!energy.valid && (energy.touched || this.formSubmitted) && this.isCompanion){
      msgs.push(`Please provide the card's energy (an integer between ${CARD_SETTINGS.MIN_ENERGY} and ${CARD_SETTINGS.MAX_ENERGY}).`);
    }
    //#endregion

    //#region Check effects
    if(this.isCharmOrTrick && effects.controls.length !== 1){
      msgs.push(`Every Charm or Trick card should have exactly one effect.`);
    } else if(this.isCompanion && effects.controls.length > 2){
      msgs.push(`Okay, so, first of all, you shouldn't be able to add more than 2 effects. So either you were naughty or something is not right. But anyways, a Companion should have only up to 2 effects. Change whatever you've done to fix this.`);
    }

    if(!effects.valid && (effects.touched || this.formSubmitted) && !this.isFood){
      msgs.push(`Effects have errors. Edit them and fix the issues to continue.`);
    }
    //#endregion

    //#region Check image
    if(!imgUrl.valid && (imgUrl.touched || this.formSubmitted)){
      msgs.push(`Please upload an image.`);
    }
    //#endregion

    return msgs;
  }
  //#endregion

  //#region Init and forms
  init = (): void => {
    this.form = this.buildForm();
    this.newCardEffectForm = this.buildEffectFormGroup()

    if(!this.id){
      this.subs.push(
        this.form.controls.effects.valueChanges.pipe(
          tap((changes) => {
            console.log(changes);
          })
        ).subscribe((changes) => {
          console.log(changes);
        })
      );
    }

    this.setsSvc.getSets().subscribe(sets => {
      this.setOptions = this.mapSetsToSelectOptions(sets);
  
      if(this.id){
        this.cardsSvc.getCard(this.id).subscribe(card => {
          if(!card){
            this.messageSvc.displayError('This card does not exist.');
        
            this.router.navigate(['/admin/cards']);
          }

          this.form = this.buildForm(card);
          this.cardEffectGroups = this.getEffectFormGroups();

          this.subs.push(
            this.form.controls.effects.valueChanges.subscribe(changes => {
              console.log(changes);
            })
          );
        });
      }
    })
  }
  //#endregion

  //#region Submit
  onSubmit = (): void => {
    this.formSubmitted = true;
    console.log(this.form, this.canSubmit);

    if(this.canSubmit){
      const cardData = this.getCardFromControls();
      console.log(cardData);

      if(this.editMode){
        
      } else {
        this.cardsSvc.createCard(this.getCardFromControls());
      }
    } else {
      this.markAllInvalidControls();
      this.messageSvc.displayError('Please check all the error messages and fix the issues to continue.')
    }
  }
  //#endregion

  //#region New Card Effects
  closeNewCardEffectForm = (): void => {
    this.newCardEffectFormOpen = false;
    this.newCardEffectForm.reset();
  }

  openNewCardEffectForm = (): void => {
    if(this.canAddMoreEffects){
      this.newCardEffectFormOpen = true;
    }
  }

  saveNewCardEffect = (): void => {
    if(!this.canAddMoreEffects) return;

    const controls = this.newCardEffectForm.controls;
    const valueControls = (<FormGroup>this.newCardEffectForm.controls.values).controls;

    if(this.newCardEffectForm.valid){
      (<FormArray>this.form.controls.effects).push(
        this.buildEffectFormGroup({
          name: controls.name.value,
          description: controls.description.value,
          type: controls.type.value,
          action: controls.action.value,
          values: {
            main: valueControls.main.value,
            energy: valueControls.energy.value,
            strength: valueControls.strength.value,
          }
        })
      );

      this.cardEffectGroups = this.getEffectFormGroups();
      this.closeNewCardEffectForm();
    } else {
      this.markAllInvalidEffectsControls(this.newCardEffectForm);
    }
  }
  //#endregion

  //#region Editable Card Effects
  closeEffectFormGroup = (formGroup: CardEffectFormGroup): void => {
    const groupId = this.cardEffectGroups.indexOf(formGroup);

    if(groupId >= 0){
      if(this.cardEffectGroups[groupId].formGroup.valid){
        this.cardEffectGroups[groupId].open = false;

        setTimeout(() => {
          this.cardEffectGroups = this.getEffectFormGroups();
        }, 600);
      } else {
        this.markAllInvalidEffectsControls(this.cardEffectGroups[groupId].formGroup);
        this.messageSvc.displayError('Please provide the correct data for an effect.');
      }
    }
  }

  deleteEffectFormGroup = (formGroup: CardEffectFormGroup): void => {
    const groupId = this.cardEffectGroups.indexOf(formGroup);

    if(groupId >= 0){
      if(this.cardEffectGroups[groupId].open){
        this.cardEffectGroups[groupId].open = false;

        setTimeout(() => {
          this.deleteGroupFromEffectsArray(this.cardEffectGroups[groupId].formGroup);
          this.cardEffectGroups.splice(groupId, 1);
        }, 600)
      } else {
        this.deleteGroupFromEffectsArray(this.cardEffectGroups[groupId].formGroup);
        this.cardEffectGroups.splice(groupId, 1);
      }
    }
  }

  deleteGroupFromEffectsArray = (formGroup: FormGroup): void => {
    const effects = (<FormArray>this.form.controls.effects);
    const effectControls = effects.controls;
    const controlId = effectControls.indexOf(formGroup);

    effectControls.splice(controlId, 1);
    effects.updateValueAndValidity();
  }

  openEffectFormGroup = (formGroup: CardEffectFormGroup): void => {
    const groupId = this.cardEffectGroups.indexOf(formGroup);

    if(groupId >= 0){
      this.cardEffectGroups[groupId].open = true;
    }
  }
  //#endregion

  //#region Helpers
  buildForm = (card?: Card): FormGroup => {
    return new FormGroup({
      type: new FormControl(card ? card.type : null, [Validators.required, this.validateCardType]),
      setId: new FormControl(card ? card.setId : '', [Validators.required, this.validateIsSetId]),
      name: new FormControl(card ? card.name : '', [Validators.required]),
      description: new FormControl(card ? card.description : ''),
      imgUrl: new FormControl(card ? card.imgUrl : '', [Validators.required]),
      cost: new FormControl(card ? card.cost : null, [Validators.required, Validators.min(CARD_SETTINGS.MIN_COST), Validators.max(CARD_SETTINGS.MAX_COST), this.validateIsInteger]),
      strength: new FormControl(card ? card.strength : null, [Validators.required, Validators.min(CARD_SETTINGS.MIN_STRENGTH), Validators.max(CARD_SETTINGS.MAX_STRENGTH), this.validateIsInteger]),
      energy: new FormControl(card ? card.energy : null, [Validators.required, Validators.min(CARD_SETTINGS.MIN_ENERGY), Validators.max(CARD_SETTINGS.MAX_ENERGY), this.validateIsInteger]),
      showFinalLook: new FormControl(false),
      effects: new FormArray(
        card ?
        card.effects.map(effect => this.buildEffectFormGroup(effect)) :
        []
      )
    });
  }

  buildEffectFormGroup = (effect?: CardEffect): FormGroup => {
    return new FormGroup({
      name: new FormControl(effect ? effect.name : '', [Validators.required]),
      description: new FormControl(effect ? effect.description : '', [Validators.required]),
      type: new FormControl(effect ? effect.type : null, [Validators.required, this.validateCardEffectType]),
      action: new FormControl(effect ? effect.action : null, [Validators.required, this.validateCardEffectAction]),
      values: new FormGroup({
        main: new FormControl(effect ? effect.values.main : null, [Validators.min(CARD_SETTINGS.MIN_EFFECT_VALUE), Validators.max(CARD_SETTINGS.MAX_EFFECT_VALUE), this.validateIsInteger]),
        energy: new FormControl(effect ? effect.values.energy : null, [Validators.min(CARD_SETTINGS.MIN_EFFECT_VALUE), Validators.max(CARD_SETTINGS.MAX_EFFECT_VALUE), this.validateIsInteger]),
        strength: new FormControl(effect ? effect.values.strength : null, [Validators.min(CARD_SETTINGS.MIN_EFFECT_VALUE), Validators.max(CARD_SETTINGS.MAX_EFFECT_VALUE), this.validateIsInteger])
      })
    })
  }

  /**
   * Checks required controls, which might be unneccessary, like cost for a food card, etc.
   */
  canIgnoreInvalidControl = (name: string): boolean => {
    if(name === 'cost' && this.isFood){
      return true;
    }

    if(name === 'strength' && !this.isCompanion || name === 'energy' && !this.isCompanion){
      return true;
    }

    if(name === 'effects' && this.isFood){
      return true;
    }
    
    return false;
  }

  getCardFromControls = (): CardMainData => {
    const effectControls = (<FormArray>this.form.controls.effects).controls;

    return {
      type: this.form.controls.type.value,
      setId: this.form.controls.setId.value,
      name: this.form.controls.name.value,
      description: this.form.controls.description.value,
      imgUrl: this.form.controls.imgUrl.value,
      cost: this.form.controls.cost.value,
      strength: this.form.controls.strength.value,
      energy: this.form.controls.energy.value,
      effects: effectControls.map(control => {
        const group = <FormGroup>control;
        const values = <FormGroup>group.controls.values;

        return {
          name: group.controls.name.value,
          description: group.controls.description.value,
          type: group.controls.type.value,
          action: group.controls.action.value,
          values: {
            main: values.controls.main.value,
            strength: values.controls.strength.value,
            energy: values.controls.energy.value
          }
        }
      })
    }
  }

  getEffectFormGroups = (): CardEffectFormGroup[] => {
    return (<FormGroup[]>(<FormArray>this.form.get('effects')).controls).map(formGroup => {
      return {
        formGroup,
        effect: this.getEffectFromFormGroup(formGroup),
        open: false
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
      }
    }
  }

  markAllInvalidControls = (): void => {
    const invalidControls: AbstractControl[] = 
      Object.values(this.form.controls)
      .filter(control => !control.valid && !(control instanceof FormArray));

    const invalidEffectsFormGroups: FormGroup[] = 
      this.cardEffectGroups.map(effectGroup => effectGroup.formGroup)
      .filter(formGroup => !formGroup.valid);

    invalidControls.forEach(control => control.markAsDirty());
    invalidEffectsFormGroups.forEach(group => this.markAllInvalidEffectsControls(group));
  }

  markAllInvalidEffectsControls = (formGroup: FormGroup): void => {
    const controls = formGroup.controls;
    const valueControls = (<FormGroup>formGroup.controls.values).controls;

    const allControls = [
      ...Object.values(controls).filter(control => !(control instanceof FormGroup)),
      ...Object.values(valueControls)
    ]
    
    allControls.forEach(control => {
      control.markAsDirty();
    })
  }
  
  mapSetsToSelectOptions = (sets: Set[]): SelectControlOption[] => {
    return sets.map(set => ({
      key: set.id,
      value: set.name
    }))
  }
  //#endregion

  //#region Validation
  validateCardType = (control: FormControl): ValidationErrors => {
    if(!Object.values(CardType).includes(control.value)){
      return {'cardTypeIncorrect': true};
    }
    return null;
  }

  validateCardEffectAction = (control: FormControl): ValidationErrors => {
    if(!Object.values(GameEffectActionType).includes(control.value)){
      return {'cardActionIncorrect': true};
    }
    return null;
  }

  validateCardEffectType = (control: FormControl): ValidationErrors => {
    if(!Object.values(CardEffectType).includes(control.value)){
      return {'effectTypeIncorrect': true};
    }
    return null;
  }

  validateIsSetId = (control: FormControl): ValidationErrors => {
    const foundSet = !!this.setOptions.find(set => set.key === control.value);

    if(!foundSet){
      return {'setIdIsIncorrect': true};
    }
    return null;
  }

  validateIsInteger = (control: FormControl): ValidationErrors => {
    if(control.value % 1 !== 0){
      return {'numberIsNotInteger': true};
    }

    return null;
  }
  //#endregion

  //#region Delete or cancel editing
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
  //#endregion
}
