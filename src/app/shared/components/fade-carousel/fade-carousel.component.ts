import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fade-carousel',
  templateUrl: './fade-carousel.component.html',
  styleUrls: ['./fade-carousel.component.scss']
})
export class FadeCarouselComponent implements OnInit, OnChanges {
  @Input() className: string;
  @Input() initIndex: number = 0;
  @Input() itemsLength: number;
  
  @Output() changedItem = new EventEmitter<number>();

  @ViewChild('itemsContainer') itemsContainer: ElementRef;

  cachedItemsLength = -1;
  cachedInitIndex = -1;
  curIndex: number;
  throttle: boolean;

  ngOnInit(): void {
    this.curIndex = this.initIndex;
    this.throttle = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.initIndex && changes.initIndex.currentValue !== this.cachedInitIndex){
      this.curIndex = changes.initIndex.currentValue;
    }
  }

  ngAfterViewChecked(): void {
    if(this.throttle) return;

    if(!(this.itemsContainer.nativeElement as HTMLElement).querySelector(`.fade-carousel-item.selected`)
      || this.cachedItemsLength !== this.itemsLength
      || this.cachedInitIndex !== this.initIndex){
      this.cachedItemsLength = this.itemsLength;
      this.cachedInitIndex = this.initIndex;
      this.onChange();
      this.throttle = true;

      setTimeout(() => {
        this.throttle = false;
      }, 300);
    }
  }

  onChange = (): void => {
    const item = (this.itemsContainer.nativeElement as HTMLElement).querySelector(`.fade-carousel-item:nth-child(${this.curIndex + 1})`);
    const items = (this.itemsContainer.nativeElement as HTMLElement).querySelectorAll(`.fade-carousel-item`);

    items.forEach(it => {
      it.classList.remove('selected');
    });

    if(item){
      setTimeout(() => {
        item.classList.add('selected');
      }, 100);
    }
  }

  prevItem = (): void => {
    if (this.curIndex - 1 < 0) {
      this.curIndex = this.itemsLength - 1;
    } else {
      this.curIndex--;
    }

    this.changedItem.emit(this.curIndex);
    this.onChange();
  }

  nextItem = (): void => {
    if (this.curIndex + 1 >= this.itemsLength) {
      this.curIndex = 0;
    } else {
      this.curIndex++;
    }

    this.changedItem.emit(this.curIndex);
    this.onChange();
  }
}
