export class SongItem {
  constructor(
    public rated: boolean,
    public favorite: boolean,
    public songUrl: string,
    public title: string,
    public artist: string
  ) {
    const tokenPosition = songUrl.search('&token');
    if (tokenPosition > -1) {
      // this.songUrl = songUrl.slice(0, tokenPosition);
    }
  }
}
