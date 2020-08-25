import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  shrinkHeader = false;
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    const scrollValue = event.target.scrollingElement.scrollTop;
    this.shrinkHeader = scrollValue > 200 ? true : false;
  }
}
