import { AfterViewInit, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggableCard]'
})
export class DraggableCardDirective implements AfterViewInit {
  @Input() blocked = false;
  @Output() played = new EventEmitter();

  baseHostLeft: number;
  baseHostTop: number;
  baseHostWidth: number;
  baseHostHeight: number;
  curTop: number;
  hostEl: HTMLElement;
  hostElCardEffect: HTMLElement;
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

  ngAfterViewInit(): void {
    this.hostElCardEffect = this.hostEl.querySelector('app-card-effect');
  }

  @HostListener('mousedown', ['$event'])
  mouseDown = (event: MouseEvent): void => {
    if(!this.blocked
      && !this.hostElCardEffect?.contains(event.target as Node)
      && this.hostElCardEffect !== event.target) {
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

  // Dekorator przypisuj??cy wykonanie metody mouseMove w momencie poruszania myszk??
  @HostListener('mousemove', ['$event'])
  mouseMove = (event: MouseEvent): void => {
    if(!this.blocked){
      // Przywr??cenie karty do r??ki gracza, je??li przesun???? myszk?? poza okno gry
      if(event.pageX < this.pageMinLeftThreshold
        || event.pageX > this.pageMaxLeftThreshold
        || event.pageY < this.pageMinTopThreshold
        || event.pageY > this.pageMaxTopThreshold){
        this.resetElement();
        return;
      }

      // Przesuni??cie karty do pozycji kursora
      if(this.dragging){
        this.setElement(event);
      }
    }
  }

  // Dekorator przypisuj??cy wykonanie metody mouseUp w momencie puszczenia przycisku myszki
  @HostListener('document:mouseup', ['$event'])
  mouseUp = (): void => {
    if(!this.blocked){
      // Zagranie karty, je??li znajduje si?? ona nad plansz??
      if(this.willBePlayed){
        this.play();
        return;
      }
  
      // Zresetowanie pozycji karty, je??li nie znajduje si?? w pozycji do zagrania
      if(this.dragging){
        this.resetElement();
      }
    }
  }

  // Metoda wywo??ywana w celu zagrania karty
  play = (): void => {
    // Emitowanie wydarzenia dla komponentu przechowuj??cego kart??
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
