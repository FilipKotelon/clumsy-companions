import { Component, OnInit } from '@angular/core';
import { TutorialService } from '@core/tutorial/tutorial.service';
import { BASIC_TUTORIAL_SLIDES, DECK_TUTORIAL_SLIDES, GAME_TUTORIAL_SLIDES, SHOP_TUTORIAL_SLIDES, Tutorial, TutorialKey, Tutorials } from '@core/tutorial/tutorial.types';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.scss'],
  animations: [fadeInOut]
})
export class TutorialModalComponent implements OnInit {
  open: boolean;
  openSub: Subscription;
  tutorials: Tutorials = {
    basic: {
      open: false,
      slides: BASIC_TUTORIAL_SLIDES
    },
    deck: {
      open: false,
      slides: DECK_TUTORIAL_SLIDES
    },
    game: {
      open: false,
      slides: GAME_TUTORIAL_SLIDES
    },
    shop: {
      open: false,
      slides: SHOP_TUTORIAL_SLIDES
    }
  };

  constructor(private tutorialSvc: TutorialService){}

  ngOnInit(): void {
    this.openSub = this.tutorialSvc.modalOpen$.subscribe(open => {
      this.open = open;
    });
  }

  get currentOpenTutorial(): Tutorial {
    return Object.values(this.tutorials).find(tutorial => tutorial.open === true);
  }

  get currentOpenTutorialKey(): TutorialKey {
    const theKey = Object.keys(this.tutorials).find(key => this.tutorials[key].open === true);
    return theKey
      ? theKey as TutorialKey
      : null;
  }

  openTutorial = (key: TutorialKey): void => {
    this.tutorials[key].open = true;
  }

  closeTutorial = (key: TutorialKey): void => {
    this.tutorials[key].open = false;
  }

  closeModal = (): void => {
    if(this.currentOpenTutorialKey){
      this.closeTutorial(this.currentOpenTutorialKey);
    }

    this.tutorialSvc.closeModal();
  }

  changeSlide = (index: number): void => {
    
  }
}
