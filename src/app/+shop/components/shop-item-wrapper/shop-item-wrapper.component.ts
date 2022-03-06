import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ShopProduct } from '@core/shop/shop.types';

@Component({
  selector: 'app-shop-item-wrapper',
  templateUrl: './shop-item-wrapper.component.html',
  styleUrls: ['./shop-item-wrapper.component.scss']
})
export class ShopItemWrapperComponent implements OnInit{
  @Input() shopProduct: ShopProduct;
  @Input() withAmount = true;
  @Output() purchased = new EventEmitter<number>();

  form: FormGroup;

  ngOnInit(): void {
    if(this.withAmount){
      this.form = new FormGroup({
        amount: new FormControl(1)
      });
    }
  }

  onPurchase = (): void => {
    if(this.withAmount){
      this.purchased.emit(
        this.form.controls.amount.value
      );
  
      this.form.controls.amount.setValue(1);
    } else {
      this.purchased.emit();
    }
  }
}
