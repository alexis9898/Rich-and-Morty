export class Character {
  constructor(
    public id: any,
    public name: string,
    public status: string,
    public species: string,
    public location:string,
    public image: string,
    public episode:string[],
    public originalId?:number,
    public userId?:number,
  ) {}
}
export interface Iinfo {
  count: number;
  pages: number;
  next: string;
  prev: string;
}

export interface Icharacter {
  info: Iinfo;
  results: Character[];
}
export interface ILocation {
  info: Iinfo;
  results: {name:string}[];
}
