import { Directive, HostListener, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})

export class DropdownDirective {
  // @HostBinding('class.open') 
  isOpen = false;
  constructor(private elementRef: ElementRef) {
  }

  @HostListener('click') mouseClick(eventData: Event) {
    const elem = this.elementRef.nativeElement.querySelector('.dropdown-menu');
    if (!this.isOpen) {
      elem.classList.add('show');
    }
    else {
      elem.classList.remove('show');
    }
    this.isOpen = !this.isOpen;
  }
}
