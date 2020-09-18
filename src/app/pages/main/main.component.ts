import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  showNowPlaying = false;
  shrinkHeader = false;
  constructor() { }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', ['$event']) onScroll(event) {
    const scrollValue = event.target.scrollingElement.scrollTop;
    this.shrinkHeader = scrollValue > 200 ? true : false;
  }

  onOpenNowPlaying() {
    this.showNowPlaying = !this.showNowPlaying;
  }
}
