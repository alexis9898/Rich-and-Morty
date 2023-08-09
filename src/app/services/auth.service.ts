import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { IUser, User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient) {}

  getUser(userName: string, password: string) {
    return this.http
      .post<IUser>('https://localhost:44309/api/account/login', {
        userName,
        password,
      })
      .pipe(
        tap((res) => {
          // console.log(res);
          this.handaleAuthentication(
            userName,
            res.id,
            res._token,
            new Date(res._tokenExpirationDate).getTime()
          ); // 60*60*1*1000=> 1h in milisecond
        })
      );
  }
  autoLoging() {
    let userData: IUser = JSON.parse(localStorage.getItem('userData') || '{}');
    if (!userData) {
      return;
    }
    const loadedUser: User = new User(
      userData.name,
      userData.id,
      userData._token,
      userData._tokenExpirationDate
    );
    if (loadedUser.token) this.user$.next(loadedUser);
  }

  addUser(userName: string, password: string) {
    console.log({ userName, password });
    return this.http
      .post<IUser>('https://localhost:44309/api/account/signUp', {
        userName,
        password,
      })
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }
  Out() {
    this.user$.next(null);
    localStorage.removeItem('userData');
  }

  handaleAuthentication(
    name: string,
    id: string,
    token: string,
    expireIn: number
  ) {
    //expireIn-time in miliSecond
    console.log(expireIn);
    console.log(new Date(expireIn));
    //console.log(new Date(new Date().getTime() + expireIn));
    // const expirationDate = new Date(new Date().getTime() + expireIn); //time in miliSecond
    const expirationDate = new Date(expireIn);
    const user = new User(name, id, token, expirationDate);
    this.user$.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}
