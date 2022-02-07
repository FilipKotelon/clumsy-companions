import { AfterContentInit, AfterViewInit, ContentChildren, Directive, ElementRef, HostBinding, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { CardComponent } from '@shared/components/card/card.component';

@Directive({
  selector: '[appFoldedCards]'
})
export class FoldedCardsDirective implements AfterContentInit {
  @ContentChildren(CardComponent, { read: ElementRef }) cards!: QueryList<ElementRef>;

  constructor(private renderer: Renderer2) {}

  @HostBinding('class')
  get tightClass(): string {
    return this.isTight ? 'tight' : '';
  }

  get isTight(): boolean {
    return this.cards.length > 9;
  }

  ngAfterContentInit(): void {
    this.rotateCards();

    this.cards.changes.subscribe(() => {
      this.rotateCards();
    })
  }

  rotateCards = (): void => {
    const middle = (this.cards.length - 1) / 2;

    this.cards.forEach((card, i) => {
      const multiplier = this.isTight ? 2 : 3;
      const dist = multiplier * Math.abs(middle - i);
      const deg = i <= middle
        ? dist
        : -dist;

      this.renderer.setStyle(card.nativeElement, 'transform', `rotate(${ deg }deg) translateY(${ 3 * dist }px)`);
    })
  }
}
