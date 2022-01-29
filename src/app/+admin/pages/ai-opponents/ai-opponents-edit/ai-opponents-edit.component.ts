import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

import { EditableOrNew } from '@admin/utility/editable-or-new.class';

import { AiOpponentsService } from '@core/ai-opponents/ai-opponents.service';
import { AvatarsService } from '@core/avatars/avatars.service';
import { Avatar } from '@core/avatars/avatars.types';
import { DecksService } from '@core/decks/decks.service';
import { Deck } from '@core/decks/decks.types';
import { FilesService } from '@core/files/files.service';
import { AiService } from '@core/game/ai/ai.service';
import { MessageService } from '@core/message/message.service';
import { PacksService } from '@core/packs/packs.service';

import { fadeInOut } from '@shared/animations/component-animations';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { AIOpponentMainData } from '@core/ai-opponents/ai-opponents.types';

@Component({
  selector: 'app-ai-opponents-edit',
  templateUrl: './ai-opponents-edit.component.html',
  styleUrls: ['./ai-opponents-edit.component.scss'],
  animations: [fadeInOut]
})
export class AiOpponentsEditComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  deletePopupOpen: boolean;
  form: FormGroup;
  formSubmitted = false;

  avatarsOptions: Avatar[] = [];
  decksOptions: Deck[] = [];
  difficultyOptions: SelectControlOption[] = [];
  packsOptions: SelectControlOption[] = [];

  avatarId = '';
  deckId = '';

  constructor(
    private aiSvc: AiService,
    private aiOpponentsSvc: AiOpponentsService,
    private avatarsSvc: AvatarsService,
    private decksSvc: DecksService,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    private packsSvc: PacksService,
    protected route: ActivatedRoute,
    private router: Router
  ) {
    super(route);
  }

  get validationMsgs(): string[] {
    const msgs: string[] = [];

    if(!this.avatarId && this.formSubmitted) {
      msgs.push('Please select an avatar.');
    }

    if(!this.deckId && this.formSubmitted) {
      msgs.push('Please select a deck.');
    }

    return msgs;
  }
  
  init = (): void => {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required]),
      coinsReward: new FormControl(null, [Validators.required]),
      rewardPackId: new FormControl(''),
      difficulty: new FormControl('', [Validators.required]),
      playable: new FormControl(false)
    });

    combineLatest([
      this.avatarsSvc.getAvatars(),
      this.decksSvc.getDecks({ global: true }),
      this.packsSvc.getPacksSelectOptions()
    ]).subscribe(([avatars, decks, packsOptions]) => {
      this.avatarsOptions = avatars;
      this.decksOptions = decks;
      this.packsOptions = packsOptions;
      this.difficultyOptions = this.aiSvc.getAiDifficultySelectOptions();

      if(this.id){
        this.aiOpponentsSvc.getAIOpponent(this.id).subscribe(aiOpponent => {
          if(!aiOpponent){
            this.messageSvc.displayError('This opponent does not exist.');
        
            this.router.navigate(['/admin/ai-opponents']);
          }

          this.avatarId = aiOpponent.avatarId;
          this.deckId = aiOpponent.deckId;
  
          this.form = new FormGroup({
            name: new FormControl(aiOpponent.name, [Validators.required]),
            coinsReward: new FormControl(aiOpponent.coinsReward, [Validators.required]),
            rewardPackId: new FormControl(aiOpponent.rewardPackId),
            difficulty: new FormControl(aiOpponent.difficulty, [Validators.required]),
            playable: new FormControl(aiOpponent.playable)
          });
        });
      }
    });
  }

  onSubmit = (): void => {
    this.formSubmitted = true;
    
    if(!this.validationMsgs.length && this.form.valid) {
      const opponentData = this.getAIOpponent();

      if(this.editMode){
        this.aiOpponentsSvc.updateAIOpponent(
          this.id,
          opponentData
        );
      } else {
        this.aiOpponentsSvc.createAIOpponent(opponentData);
      }
    } else {
      this.markAllInvalidControls();
    }
  }

  getAIOpponent = (): AIOpponentMainData => {
    const controls = this.form.controls;

    return {
      name: controls.name.value,
      coinsReward: +controls.coinsReward.value,
      avatarId: this.avatarId,
      deckId: this.deckId,
      difficulty: controls.difficulty.value,
      rewardPackId: controls.rewardPackId.value,
      playable: controls.playable.value
    }
  }

  markAllInvalidControls = (): void => {
    const invalidControls: AbstractControl[] = 
      Object.values(this.form.controls)
      .filter(control => !control.valid);

    invalidControls.forEach(control => control.markAsDirty());
  }

  chooseAvatarId = (id: string) => {
    this.avatarId = id;
  }

  chooseDeckId = (id: string) => {
    this.deckId = id;
  }

  onOpenDeletePopup = (): void => {
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteAIOpponent = (): void => {
    this.aiOpponentsSvc.deleteAIOpponent(this.id, '/admin/ai-opponents');
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
      this.router.navigate(['/admin/ai-opponents']);
    }
  }
}
