import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Gift } from '@core/gift/gift.types';
import { GiftService } from '@core/gift/gift.service';

import { fadeInOut } from '@shared/animations/component-animations';

@Component({
  selector: 'app-gift-modal',
  templateUrl: './gift-modal.component.html',
  styleUrls: ['./gift-modal.component.scss'],
  animations: [fadeInOut]
})
export class GiftModalComponent implements OnInit {
  currentGift: Gift = null;
  gifts: Gift[] = [];
  giftSvcSub: Subscription;
  open = false;

  constructor(
    private giftsSvc: GiftService
  ) { }

  ngOnInit(): void {
    this.giftSvcSub = this.giftsSvc.closedGift.subscribe(gifts => {
      this.gifts = gifts;
      this.open = !!gifts.length;

      if(this.open){
        this.currentGift = gifts[gifts.length - 1];
      } else {
        this.currentGift = null;
      }
    });
  }

  onClose = () => {
    this.giftsSvc.closeGift();
  }
}
