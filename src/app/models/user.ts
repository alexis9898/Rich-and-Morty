export class User{
  constructor(
    public name: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date,
  ){}

  get token(){
    console.log(this._tokenExpirationDate);
    console.log(new Date(this._tokenExpirationDate));
    if(!this._tokenExpirationDate || new Date()>new Date(this._tokenExpirationDate)){
      console.log('expire');
      return null;
    }
    console.log('not expire');
    return this._token;
  }
}

export interface IUser {
  name: string,
  id: string,
  _token: string,
  _tokenExpirationDate: Date,
}
