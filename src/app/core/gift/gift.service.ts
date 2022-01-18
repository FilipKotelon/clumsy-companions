import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Gift } from './gift.types';

@Injectable({
  providedIn: 'root'
})
export class GiftService {
  closedGift = new Subject<Gift[]>();
  giftsToOpen: Gift[] = [];

  constructor() { }

  addGift = (gift: Gift) => {
    this.giftsToOpen.push(gift);
    this.closedGift.next(this.giftsToOpen);
  }

  closeGift = () => {
    this.giftsToOpen.pop();
    this.closedGift.next(this.giftsToOpen);
  }
}
