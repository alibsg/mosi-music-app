export class Track {
  constructor(
    public id: string,
    public title: string,
    public artist: string,
    public genre: string,
    public album: string,
    public year: string,
    public url: string,
    public date: Date,
    public user: string
  ) { }
}

export class TrackData {
  constructor(
    private id: string,
    private data: string
  ) {}
}

