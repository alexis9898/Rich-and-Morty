export class Character {
  constructor(
    public id: any,
    public name: string,
    public status: string,
    public species: string,
    public location: { name: number } | null,
    public image: string,
    public originalId?:number,
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
