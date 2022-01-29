import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fade-carousel',
  templateUrl: './fade-carousel.component.html',
  styleUrls: ['./fade-carousel.component.scss']
})
export class FadeCarouselComponent implements OnInit {
  @Input() className: string;
  @Input() initIndex = 0;
  @Input() itemsLength: number;
  
  @Output() changedItem = new EventEmitter<number>();

  @ViewChild('itemsContainer') itemsContainer: ElementRef;

  curIndex: number;

  ngOnInit(): void {
    this.curIndex = this.initIndex;
  }
  
  onChange = (): void => {
    const item = (this.itemsContainer.nativeElement as HTMLElement).querySelector(`.fade-carousel-item:nth-child(${this.curIndex + 1})`);
    const items = (this.itemsContainer.nativeElement as HTMLElement).querySelectorAll(`.fade-carousel-item`);

    items.forEach(it => {
      it.classList.remove('selected');
    });

    if(item){
      item.classList.add('selected');
    }
  }

  prevItem = (): void => {
    if (this.curIndex - 1 < 0) {
      this.curIndex--;
    } else {
      this.curIndex = this.itemsLength - 1;
    }

    this.changedItem.emit(this.curIndex);
    this.onChange();
  }

  nextItem = (): void => {
    if (this.curIndex + 1 < this.itemsLength) {
      this.curIndex--;
    } else {
      this.curIndex = 0;
    }

    this.changedItem.emit(this.curIndex);
    this.onChange();
  }
}
