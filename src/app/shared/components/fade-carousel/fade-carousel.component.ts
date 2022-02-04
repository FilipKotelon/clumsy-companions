import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-fade-carousel',
  templateUrl: './fade-carousel.component.html',
  styleUrls: ['./fade-carousel.component.scss']
})
export class FadeCarouselComponent implements OnInit, AfterViewInit {
  @Input() className: string;
  @Input() initIndex: number;
  @Input() itemsLength: number;
  
  @Output() changedItem = new EventEmitter<number>();

  @ViewChild('itemsContainer') itemsContainer: ElementRef;

  curIndex: number;

  ngOnInit(): void {
    this.curIndex = this.initIndex || 0;
  }

  ngAfterViewInit(): void {
    this.onChange();
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
