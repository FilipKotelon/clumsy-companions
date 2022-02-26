import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggableCard]'
})
export class DraggableCardDirective {
  @Input() blocked = false;
  @Output() played = new EventEmitter();

  baseHostLeft: number;
  baseHostTop: number;
  baseHostWidth: number;
  baseHostHeight: number;
  curTop: number;
  hostEl: HTMLElement;
  minTopThreshold: number;
  maxTopThreshold: number;
  minLeftThreshold: number;
  maxLeftThreshold: number;
  pageMinLeftThreshold: number;
  pageMaxLeftThreshold: number;
  pageMinTopThreshold: number;
  pageMaxTopThreshold: number;

  dragging = false;
  playTopThreshold = -100;

  constructor(private hostRef: ElementRef, private renderer: Renderer2) {
    this.hostEl = hostRef.nativeElement;
    this.init();
  }

  @HostBinding('class.dragging')
  get draggingClass(): boolean {
    return this.dragging;
  }

  @HostBinding('class.will-be-played')
  get willBePlayed(): boolean {
    return this.curTop < this.playTopThreshold;
  }

  init = (): void  => {
    this.renderer.setStyle(this.hostEl, 'position', 'relative');
  }

  @HostListener('mousedown', ['$event'])
  mouseDown = (event: MouseEvent): void => {
    if(!this.blocked) {
      this.dragging = true;
      this.baseHostLeft = this.hostEl.getBoundingClientRect().left;
      this.baseHostTop = this.hostEl.getBoundingClientRect().top;
      this.baseHostWidth = this.hostEl.getBoundingClientRect().width;
      this.baseHostHeight = this.hostEl.getBoundingClientRect().height;
  
      this.minTopThreshold = -(.5 * window.innerHeight);
      this.maxTopThreshold = 150;
      this.minLeftThreshold = -(.99 * this.baseHostLeft);
      this.maxLeftThreshold = (.99 * (window.innerWidth - this.hostEl.getBoundingClientRect().right));
      
      this.pageMinLeftThreshold = .03 * window.innerWidth;
      this.pageMaxLeftThreshold = .97 * window.innerWidth;
      this.pageMinTopThreshold = .03 * window.innerHeight;
      this.pageMaxTopThreshold = .97 * window.innerHeight;
      this.setElement(event);
    }
  }

  @HostListener('mousemove', ['$event'])
  mouseMove = (event: MouseEvent): void => {
    if(!this.blocked){
      if(event.pageX < this.pageMinLeftThreshold || event.pageX > this.pageMaxLeftThreshold || event.pageY < this.pageMinTopThreshold || event.pageY > this.pageMaxTopThreshold){
        this.resetElement();
        return;
      }
  
      if(this.dragging){
        this.setElement(event);
      }
    }
  }

  @HostListener('document:mouseup', ['$event'])
  mouseUp = (event: MouseEvent): void => {
    if(!this.blocked){
      if(this.willBePlayed){
        this.play();
        return;
      }
  
      if(this.dragging){
        this.resetElement();
      }
    }
  }

  play = (): void => {
    this.played.emit();
    this.blocked = true;
  }

  resetElement = (): void => {
    this.dragging = false;
    this.renderer.setStyle(this.hostEl, 'left', '0px');
    this.renderer.setStyle(this.hostEl, 'top', '0px');
    this.curTop = 0;
  }

  setElement = (event: MouseEvent): void => {
    const targetLeft = event.pageX - this.baseHostLeft - (this.baseHostWidth / 2);
    const targetTop = event.pageY - this.baseHostTop - (this.baseHostTop / 2);

    if(targetLeft > this.minLeftThreshold && targetLeft < this.maxLeftThreshold){
      this.renderer.setStyle(this.hostEl, 'left', `${targetLeft}px`);
    }

    if(targetTop > this.minTopThreshold && targetTop < this.maxTopThreshold){
      this.renderer.setStyle(this.hostEl, 'top', `${targetTop}px`);
      this.curTop = targetTop;
    }
  }
}
