import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-music-seeker',
  templateUrl: './music-seeker.component.html',
  styleUrls: ['./music-seeker.component.scss']
})
export class MusicSeekerComponent implements OnInit {
  @Output() seekerChange = new EventEmitter<number>();
  @Input() seekerValue: number;
  @Input() bufferValue: number = 50;
  @Input() highLighted: boolean;

  constructor() { }

  ngOnInit(): void {  }

  onInputChange(event) {
    this.seekerValue = event.target.value;
  }

  onSeekChange(event) {
    this.seekerChange.emit(event.target.value);
  }
}
