import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as jsmediatags from 'jsmediatags';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit, OnDestroy {
  playTickSubscription: Subscription;
  seekerValue = 0;
  volumeLevel = 50;
  highLighted = false;
  playing = false;
  durationMinutes = 0;
  durationSeconds = 0;
  currentMinutes = 0;
  currentSeconds = 0;
  private readonly defaultCoverUrl = '../../assets/images/no-cover.png';
  coverUrl = this.defaultCoverUrl;
  artist = '';
  title = '';

  audio = new Audio();

  constructor() { }

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

  getSongInfo(url: string) {
    jsmediatags.Config.setDisallowedXhrHeaders([
      'if-modified-since'
    ]);

    jsmediatags.Config.EXPERIMENTAL_avoidHeadRequests();
    jsmediatags.read(url, {
      onSuccess: tag => {
        const {picture, artist, title} = tag.tags; // create reference to track art
        if (picture) {
          let base64String = '';
          for (const data of picture.data) {
            base64String += String.fromCharCode(data);
          }
          this.coverUrl  = 'data:' + picture.format + ';base64,' + window.btoa(base64String);
        } else {
          this.coverUrl = this.defaultCoverUrl;
        }
        if (artist) {
          this.artist = artist;
        }
        if (title) {
          this.title = title;
        }
      },
      onError: error => {
        this.coverUrl = this.defaultCoverUrl;
      }
    });
  }

  ngOnInit(): void {
    this.audio.src = 'https://firebasestorage.googleapis.com/v0/b/mosmuse-7b5ac.appspot.com/o/music%2F01.%20Heartbreaker.mp3?alt=media&token=b5638282-f612-4e8b-a80c-d105fb842511';
    // this.audio.src = 'https://firebasestorage.googleapis.com/v0/b/mosmuse-7b5ac.appspot.com/o/music%2F01%20-%20Rogue%20Waves%20I~1.mp3?alt=media&token=f2bf4e18-368f-460f-a9e1-50476ec1cee6'; //'../../../assets/audio/01-Rogue Waves.mp3';
    this.getSongInfo(this.audio.src);
    this.audio.load();
    this.audio.ondurationchange = () => {
      this.duration = this.audio.duration;
    };

    this.audio.onended = () => {
      this.stopTickTimer();
      this.playing = false;
    };
  }

  ngOnDestroy(): void {
    this.stopTickTimer();
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

}
