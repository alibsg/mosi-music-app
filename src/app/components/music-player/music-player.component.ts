import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MusicFileService } from 'src/app/services/music-file.service';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss'],
  providers: [MusicFileService]
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  @Output() showNowPlaying = new EventEmitter();
  playTickSubscription: Subscription;
  songInfoSubscription: Subscription;
  seekerValue = 0;
  volumeLevel = 50;
  highLighted = false;
  playing = false;
  durationMinutes = 0;
  durationSeconds = 0;
  currentMinutes = 0;
  currentSeconds = 0;
  coverUrl = this.musicFileService.defaultCoverUrl;
  artist = '';
  title = '';

  audio = new Audio();

  constructor(private musicFileService: MusicFileService) { }

  set duration(value: number) {
    this.durationMinutes = Math.floor(value / 60);
    this.durationSeconds = Math.floor(value % 60);
  }

  set currentTime(value: number) {
    this.currentMinutes = Math.floor(value / 60);
    this.currentSeconds = Math.floor(value % 60);
  }

  seek(value: number) {
    if (!isNaN(this.audio.duration) && isFinite(this.audio.duration)) {
      this.audio.currentTime = this.audio.duration * (value / 100);
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.stopTickTimer();
    if (this.songInfoSubscription) {
      this.songInfoSubscription.unsubscribe();
    }
  }

  onSeek(value: number) {
    this.seek(value);
    this.seekerValue = value;
  }

  onHover(value: boolean) {
    this.highLighted = value;
  }

  configureTickTimer() {
    const source = interval(1000);
    this.playTickSubscription = source.pipe(tap(() => {
      this.currentTime = this.audio.currentTime;
      this.seekerValue = (this.audio.currentTime / this.audio.duration) * 100;
    })).subscribe();
  }

  stopTickTimer() {
    if (this.playTickSubscription) {
      this.playTickSubscription.unsubscribe();
    }
  }

  onPlayPause() {
    if (!this.playing) {
      this.seek(this.seekerValue);
      this.audio.play();
      this.currentTime = this.audio.currentTime;
      this.configureTickTimer();
    } else {
      this.audio.pause();
      this.stopTickTimer();
    }
    this.playing = !this.playing;
  }

  loadMusic(url: string) {
    this.audio.src = url;
    this.coverUrl = this.musicFileService.defaultCoverUrl;
    this.songInfoSubscription = this.musicFileService.musicInfoReady.subscribe(info => {
      this.coverUrl = info.coverUrl;
      this.artist = info.artist;
      this.title = info.title;
    });

    this.musicFileService.getSongInfo(this.audio.src);
    this.audio.load();
    this.audio.ondurationchange = () => {
      this.duration = this.audio.duration;
    };

    this.audio.onended = () => {
      this.stopTickTimer();
      this.playing = false;
    };
  }

  onNowPlaying() {
    this.showNowPlaying.emit();
  }

}
