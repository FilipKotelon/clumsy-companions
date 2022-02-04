import { EditableOrNew } from '@admin/utility/editable-or-new.class';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';

import { Card, CardQueryParams, CardType } from '@core/cards/cards.types';
import { CardsService } from '@core/cards/cards.service';
import { Deck, DeckMainData, DECK_SETTINGS } from '@core/decks/decks.types';
import { DecksService } from '@core/decks/decks.service';
import { PlayerService } from '@core/player/player.service';
import { SetsService } from '@core/sets/sets.service';

import { fadeInOut } from '@shared/animations/component-animations';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { MessageService } from '@core/message/message.service';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { Sleeve } from '@core/sleeves/sleeves.types';

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
  deckExpanded = false;
  detailsOpen = false;
  formSubmitted = false;
  inAdmin = false;
  setOptions: SelectControlOption[] = [];
  setSelectOpen = false;
  sleevesOptions: Sleeve[] = [];

  addedCards: Card[] = [];
  form: FormGroup;
  thumbnailCardId = '';
  setId = '';
  sleeveId = '';
  
  constructor(
    protected route: ActivatedRoute,
    private cardsSvc: CardsService,
    private decksSvc: DecksService,
    private messageSvc: MessageService,
    private playerSvc: PlayerService,
    private router: Router,
    private setsSvc: SetsService,
    private sleevesSvc: SleevesService
  ) {
    super(route);
  }

  get canSubmit(): boolean {
    return this.form.valid && this.hasAcceptableAmountOfCards && !!this.sleeveId && !!this.thumbnailCardId;
  }

  get cardsAmountInfo(): string {
    return `A deck can have between ${DECK_SETTINGS.MIN_CARDS} and ${DECK_SETTINGS.MAX_CARDS} cards.`;
  }

  get detailsErrorsCount(): number {
    let count = 0;

    if(!this.sleeveId) count++;
    if(!this.thumbnailCardId) count++;

    return count;
  }

  get hasAcceptableAmountOfCards(): boolean {
    return this.addedCards.length <= DECK_SETTINGS.MAX_CARDS && this.addedCards.length >= DECK_SETTINGS.MIN_CARDS;
  }

  get uniqueAddedCards(): Card[] {
    return this.addedCards.reduce((prev, cur) => {
      const prevToIds = prev.map(prev => prev.id);
      if(!prevToIds.includes(cur.id)){
        prev.push(cur);
      }

      return prev;
    }, []);
  }

  get validationMsgs(): string[] {
    const msgs: string[] = [];
    const controls = this.form.controls;

    const name = controls.name.value;

    if(!this.hasAcceptableAmountOfCards && this.formSubmitted){
      msgs.push(`This deck has a wrong amount of cards (should be between ${DECK_SETTINGS.MIN_CARDS} and ${DECK_SETTINGS.MAX_CARDS}).`);
    }

    if(!name && this.formSubmitted){
      msgs.push(`Please name the deck.`);
    }

    if(!this.setId && this.formSubmitted){
      msgs.push(`Please choose a card set.`);
    }

    if(!this.thumbnailCardId && this.formSubmitted){
      msgs.push(`Please choose the deck thumbnail in details (next to the name).`);
    }

    if(!this.sleeveId && this.formSubmitted){
      msgs.push(`Please choose the deck sleeve in details (next to the name).`);
    }

    return msgs;
  }

  init = (): void => {
    this.listenIfInAdmin();
    this.getSetOptions();
    this.getSleevesOptions();
    this.initForm('', '');

    if(this.id){
      this.loadDeck().subscribe(deck => {
        this.initForm(deck.name, deck.setId);
        this.getCards();
      })
    } else {
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
          this.thumbnailCardId = deck.thumbnailCardId;
          this.setId = deck.setId;
          this.sleeveId = deck.sleeveId;

          this.cardsSvc.getCards({ ids: deck.cardIds }).subscribe(cards => {
            this.addedCards = cards;
          })
        })
      );
  }

  onSubmit = (): void => {
    this.formSubmitted = true;

    if(this.canSubmit){
      const deck = this.getDeck();

      if(this.editMode){
        this.decksSvc.updateDeck(this.id, deck);
      } else {
        this.decksSvc.createDeck(deck, !this.inAdmin);
      }
    }
  }

  getCards = (): void => {
    if(this.inAdmin) {
      this.cardsSvc.getCards({ set: this.setId, availableInGame: true })
        .subscribe(cards => {
          this.cardOptions = cards;
        });
    } else {
      this.playerSvc.getOwnedCardsIds()
        .pipe(
          take(1)
        )
        .subscribe(cardsIds => {
          const params: CardQueryParams = { set: this.setId, availableInGame: true };

          if(cardsIds.length) {
            params.ids = cardsIds;
          }

          this.cardsSvc.getCards(params)
            .subscribe(cards => {
              this.cardOptions = cards;
            });
        })
    }
  }

  getCardAmount = (card: Card): number => {
    return this.addedCards.filter(addedCard => addedCard.id === card.id).length;
  }

  getCardMaxAmount = (card: Card): number => {
    if(card.type === CardType.Food) return DECK_SETTINGS.MIN_CARDS - 5;
    if(card.cost > 6) return 3;
    if(card.cost > 4) return 4;
    if(card.cost > 2) return 5;
    return 6;
  }

  getDeck = (): DeckMainData => {
    return {
      thumbnailCardId: this.thumbnailCardId,
      setId: this.setId,
      sleeveId: this.sleeveId,
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

  getSleevesOptions = (): void => {
    let sleeves$: Observable<Sleeve[]>;

    if(this.inAdmin){
      sleeves$ = this.sleevesSvc.getSleeves();
    } else {
      sleeves$ = this.playerSvc.getOwnedSleeves().pipe(take(1));
    }

    sleeves$.subscribe(sleeves => {
      this.sleevesOptions = sleeves;
    })
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

  chooseSleeve = (id: string): void => {
    this.sleeveId = id;
  }

  chooseThumbnail = (id: string): void => {
    this.thumbnailCardId = id;
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

  onOpenDeletePopup = (): void => {
    this.deletePopupOpen = true;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
  }

  deleteDeck = (): void => {
    this.decksSvc.deleteDeck(
      this.id,
      this.inAdmin ? '/admin/decks' : 'hub/decks',
      !this.inAdmin
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
    if(this.inAdmin){
      this.router.navigate(['/admin/decks']);
    } else {
      this.router.navigate(['/hub/decks']);
    }
  }

  collapseDeck = (): void => {
    this.deckExpanded = false;
  }

  expandDeck = (): void => {
    this.deckExpanded = true;
  }
}
