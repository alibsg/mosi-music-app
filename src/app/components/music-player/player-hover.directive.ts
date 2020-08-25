import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appPlayerHover]'
})
export class PlayerHoverDirective {
  @Output() hover = new EventEmitter<boolean>();
  constructor() { }

  @HostListener('mouseenter') onHover() {
    this.hover.emit(true);
  }

  @HostListener('mouseleave') onLeave() {
    this.hover.emit(false);
  }
}
