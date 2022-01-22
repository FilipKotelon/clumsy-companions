import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import { Card, CardQueryParams } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { Deck, DeckMainData, DECK_SETTINGS } from '@core/decks/decks.types';
import { DecksService } from '@core/decks/decks.service';
import { PlayerService } from '@core/player/player.service';
import { SetsService } from '@core/sets/sets.service';

import { fadeInOut } from '@shared/animations/component-animations';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { MessageService } from '@core/message/message.service';

@Component({
  selector: 'app-edit-deck',
  templateUrl: './edit-deck.component.html',
  styleUrls: ['./edit-deck.component.scss'],
  animations: [fadeInOut]
})
export class EditDeckComponent extends EditableOrNew {
  cancelPopupOpen: boolean;
  cardOptions: Card[] = [];
  deletePopupOpen: boolean;
  detailsOpen = false;
  deckExpanded = false;
  inAdmin = false;
  setOptions: SelectControlOption[] = [];
  setSelectOpen = false;

  addedCards: Card[] = [];
  form: FormGroup;
  imgUrl = '';
  setId = '';
  sleeveImgUrl = '';
  
  constructor(
    protected route: ActivatedRoute,
    private cardsSvc: CardsService,
    private decksSvc: DecksService,
    private messageSvc: MessageService,
    private playerSvc: PlayerService,
    private router: Router,
    private setsSvc: SetsService
  ) {
    super(route);
  }

  get hasAcceptableAmountOfCards(): boolean {
    return this.addedCards.length < DECK_SETTINGS.MAX_CARDS && this.addedCards.length > DECK_SETTINGS.MIN_CARDS;
  }

  get uniqueAddedCards(): Card[] {
    return this.addedCards.reduce((prev, cur) => {
      if(!prev.includes(cur)){
        prev.push(cur);
      }

      return prev;
    }, []);
  }

  init = (): void => {
    this.listenIfInAdmin();
    this.getSetOptions();

    if(this.id){
      this.loadDeck().subscribe(deck => {
        this.initForm(deck.name, deck.setId);
        this.getCards();
      })
    } else {
      this.initForm('', '');
      this.openSetSelect();
    }
  }

  initForm = (name: string, setId: string): void => {
    this.form = new FormGroup({
      name: new FormControl(name, [Validators.required]),
      setId: new FormControl(setId, [Validators.required])
    });
  }

  listenIfInAdmin = (): void => {
    if(this.router.url.includes('admin')){
      this.inAdmin = true;
    } else {
      this.inAdmin = false;
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((e) => {
      if(e instanceof NavigationEnd){
        if(e.url.includes('admin')){
          this.inAdmin = true;
        } else {
          this.inAdmin = false;
        }
      }
    });
  }

  loadDeck = (): Observable<Deck> => {
    return this.decksSvc.getDeck(this.id)
      .pipe(
        tap(deck => {
          this.imgUrl = deck.imgUrl;
          this.sleeveImgUrl = deck.sleeveImgUrl;
        })
      );
  }

  onSubmit = (): void => {

  }

  getCards = (): void => {
    if(this.inAdmin) {
      this.cardsSvc.getCards({ set: this.setId })
        .subscribe(cards => {
          this.cardOptions = cards;
          console.log(this.cardOptions);
        });
    } else {
      this.playerSvc.getOwnedCardsIds()
        .subscribe(cardsIds => {
          const params: CardQueryParams = { set: this.setId };

          if(cardsIds.length) {
            params.ids = cardsIds;
          }

          this.cardsSvc.getCards(params)
            .subscribe(cards => {
              this.cardOptions = cards;
              console.log(this.cardOptions);
            });
        })
    }
  }

  getCardAmount = (card: Card): number => {
    return this.addedCards.filter(addedCard => addedCard.id === card.id).length;
  }

  getDeck = (): DeckMainData => {
    return {
      imgUrl: this.imgUrl,
      setId: this.setId,
      sleeveImgUrl: this.sleeveImgUrl,
      cardIds: this.addedCards.map(card => card.id),
      name: this.form.controls.name.value,
      global: this.inAdmin
    }
  }

  getSetOptions = (): void => {
    this.setsSvc.getSetSelectOptions().subscribe(setOptions => {
      this.setOptions = setOptions;
    });
  }

  chooseSetId = (): void => {
    if(this.form.controls.setId.valid){
      const oldSetId = this.setId;
      this.setId = this.form.controls.setId.value;
  
      if(oldSetId !== this.setId){
        //Reset added cards
        this.addedCards = [];
        this.getCards();
      }
      
      if(!this.form) {
        this.initForm('', this.setId);
      }
  
      this.setSelectOpen = false;
    } else {
      this.messageSvc.displayError('Select a set!');
    }
  }

  openSetSelect = (): void => {
    this.setSelectOpen = true;
  }

  openDetails = (): void => {
    this.detailsOpen = true;
  }

  closeDetails = (): void => {
    this.detailsOpen = false;
  }

  onDecreaseCardAmount = (card: Card): void => {
    let cardIndex = this.addedCards.map(addedCard => addedCard.id).indexOf(card.id);
    console.log(this.addedCards, card, cardIndex);
    
    if(cardIndex >= 0) {
      this.addedCards.splice(cardIndex, 1);
    }
  }

  onIncreaseCardAmount = (card: Card): void => {
    this.addedCards.push(card);
  }

  onRemoveCard = (card: Card): void => {
    while(this.addedCards.map(addedCard => addedCard.id).indexOf(card.id) >= 0){
      this.addedCards.splice(this.addedCards.map(addedCard => addedCard.id).indexOf(card.id), 1);
    }
  }

  collapseDeck = (): void => {
    this.deckExpanded = false;
  }

  expandDeck = (): void => {
    this.deckExpanded = true;
  }

  onOpenDeletePopup = (): void => {
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteDeck = (): void => {
    this.decksSvc.deleteDeck(
      this.id,
      this.inAdmin ? '/admin/decks' : 'hub/decks'
    );
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
    this.router.navigate(['/admin/packs']);
  }
}
