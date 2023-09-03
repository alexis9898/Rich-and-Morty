import { HostListener, Injectable } from '@angular/core';
import {
  tap,
  map,
  BehaviorSubject,
  catchError,
  throwError,
  Observable,
  take,
  switchMap,
} from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
// import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Icharacter, Iinfo, Character, ILocation } from '../models/character';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  // charcters$ = new BehaviorSubject<character[]>([]);

  url = 'https://rickandmortyapi.com/api/character/';
  CharctersInfo$ = new BehaviorSubject<Icharacter | null>(null);
  userCharcters$ = new BehaviorSubject<Character[]>([]);
  locations$ = new BehaviorSubject<string[]>([]);
  // characterSearch$ = new BehaviorSubject<boolean>(false);
  errorSearch$ = new BehaviorSubject<boolean>(false);
  locations = [];
  charatersBeforeSearch:{characterInfo:Icharacter, charater:Character[]} | null;
  spicies = [
    'Humanoid',
    'Alien',
    'unknown',
    'Human',
    'Poopybutthole',
    'Mythological Creature',
    'Animal',
    'Robot',
    'Cronenberg',
    'Disease',
  ];
  status = ['Alive', 'Dead', 'unknown'];
  constructor(private http: HttpClient, private authService: AuthService) {}

  getCharacters() {
    return this.http.get<Icharacter>(this.url).pipe(
      map((res: any) => {
        return this.mapp(res);
      }),
      tap((res) => {
        let user = this.authService.user$.getValue();
        if (!user) {
          this.CharctersInfo$.next(res);
          return;
        }
        let userId = user.id;
        this.getCharactersOriginalFromMyData(res, userId).subscribe(
          (characters) => {
            res.results = characters;
            console.log(res);
            this.CharctersInfo$.next(res);
            this.getUserCharacters(userId).subscribe();
          }
        );
      })
    );
  }

  mapp(res: any) {
    // console.log(res)
    for (let i = 0; i < res.results.length; i++) {
      res.results[i].location = res.results[i].location.name;
      // res.results[i].episode=
      // console.log(res.results[i].location);
    }
    return res;
  }

  location(res: ILocation) {
    // console.log(res);
    let locationArr: string[] = [];
    for (let i = 0; i < res.results.length; i++)
      locationArr.push(res.results[i].name);
    return locationArr;
    // if(res.info.next){
    //   this.getLocation(res.info.next).subscribe();
    // }
  }

  getAllLocationByPag(url: string) {
    //because tap the function return all locations
    // let locationArr:string[]=[];
    if (url == '') url = 'https://rickandmortyapi.com/api/location';
    return this.http.get<ILocation>(url).pipe(
      tap((res) => {
        // console.log(res);
        // this.locations$.next(res);
        this.addAllLocationArr(res);
      })
    );
  }

  addAllLocationArr(location: ILocation) {
    let locationArr = this.location(location);
    this.locations = this.locations.concat(locationArr);
    if (location.info.next)
      this.getAllLocationByPag(location.info.next).subscribe();
    else{
      this.locations$.next(this.locations);
    }
  }


  getOriginalCharacterFromOriginalSeriese(character: number) {
    return this.http.get<Character>(this.url + character);
  }

  getOriginalCharactersFromOriginalSeriese(characters: number[]) {
    return this.http.get<Character[]>(this.url + characters);
  }

  search(name:string){
    console.log(name.length)
    if(name.length==0){
      if(!this.charatersBeforeSearch)
        return;
      this.CharctersInfo$.next(this.charatersBeforeSearch.characterInfo);
      this.userCharcters$.next(this.charatersBeforeSearch.charater);
      this.charatersBeforeSearch=null;
      return;
    }
    if(!this.charatersBeforeSearch){

      this.charatersBeforeSearch={characterInfo:this.CharctersInfo$.getValue(),charater:this.userCharcters$.getValue()}
      // this.charatersBeforeSearch.characterInfo=this.CharctersInfo$.getValue();
      // this.charatersBeforeSearch.charater=this.userCharcters$.getValue();
      console.log(this.charatersBeforeSearch)
    }
    this.getCharactersFilters(0,null,name).subscribe(
      res=>{}
      ,err=>{
        // this.CharctersInfo$.next(null);
        // this.userCharcters$.next([]);
        this.errorSearch$.next(true);
      });
  }

  getCharactersFilters(page: number, species?: string,name?:string) {
    let url = this.url + '?';
    const too = '&';
    let ifToo = false;
    if (page && page != 0) {
      ifToo = true;
      url += 'page=' + page;
    }

    if (species && species != '') {
      url += ifToo ? '&' : '';
      ifToo = true;
      url += 'species=' + species;
    }

    if (name && name != '') {
      url += ifToo ? '&' : '';
      ifToo = true;
      url += 'name=' + name;
    }

    return this.http.get<Icharacter>(url).pipe(
      map((res: any) => {
        return this.mapp(res);
      }),
      tap((res) => {
        let user = this.authService.user$.getValue();
        if (!user) {
          this.CharctersInfo$.next(res);
          return;
        }
        let userId = user.id;
        this.getCharactersOriginalFromMyData(res, userId).subscribe(
          (characters) => {
            let sendCharacter = res;
            sendCharacter.results = characters;
            this.CharctersInfo$.next(sendCharacter);
            this.getUserCharacters(userId, species,name).subscribe();
          }
        );
      })
    );
  }

  getCharactersOriginalFromMyData(characters: Icharacter, userId: string) {
    let send = { Characters: characters.results, userId: userId };
    return this.http.post<Character[]>(
      'https://localhost:44309/api/characters/charcters-original',
      send
    );
  }

  getCharacterbyPagt(url: string) {
    return this.http.get<Icharacter>(url).pipe(
      map((res: any) => {
        return this.mapp(res);
      }),
      tap((res) => {
        let user = this.authService.user$.getValue();
        if (!user) {
          let sendCharacter = this.CharctersInfo$.getValue();
          if (sendCharacter) {
            sendCharacter.results = sendCharacter.results.concat(res.results);
            console.log(sendCharacter.results);
          } else {
            sendCharacter = res;
          }
          sendCharacter.info = res.info;
          console.log(sendCharacter);
          this.CharctersInfo$.next(sendCharacter);
          return;
        }
        const userId = user.id;
        this.getCharactersOriginalFromMyData(res, userId).subscribe(
          (characters) => {
            let sendCharacter = this.CharctersInfo$.getValue();
            if (sendCharacter) {
              sendCharacter.results = sendCharacter.results.concat(characters);
            } else {
              sendCharacter = res;
            }
            let userCharacters = this.userCharcters$.getValue();
            // if(!userCharacters)
            //   sendCharacter.results = userCharacters.concat(sendCharacter.results);
            sendCharacter.info = res.info;
            // var myCharacters=this.userCharcters$.getValue();
            // sendCharacter.results=myCharacters.concat(sendCharacter.results);
            this.CharctersInfo$.next(sendCharacter);
          }
        );
      })
    );
  }

  getUserCharacters(userId: string, spicies?: string,name?:string) {
    return this.http
      .get<Character[]>(
        'https://localhost:44309/api/characters/charcters-my-server/' +
          userId +
          '/' +
          spicies +
          '/' +
          name
      )
      .pipe(
        tap((characters) => {
          this.userCharcters$.next(characters);
        })
      );
  }

  getOriginalCharacterFromMySql(character: Character, userId: string) {
    let send = {
      Character: character,
      userId: userId,
    };
    // if(!character || !character.originalId || character.originalId==0)
    //   return null;
    console.log(send);
    return (
      this.http
        .post<Character>(
          'https://localhost:44309/api/characters/original-charcter',
          send
        )
        // .catch((error)=>{
        //   return Observable.throw(error);
        // })
        .pipe(
          // take(1),
          catchError(this.handleError)
        )
    );
  }

  addCharacter(character: Character, userId: string, originalId?: number) {
    let send = {
      Character: character,
      userId: userId,
      originalId: originalId,
    };
    return this.http
      .post<Character>(
        'https://localhost:44309/api/characters/add-character',
        send
      )
      .pipe(
        tap((character) => {
          if (character.originalId) {
            let sendCharacter = this.CharctersInfo$.getValue();
            const findIndex = sendCharacter.results.findIndex(
              (ch) => ch.originalId == character.originalId
            );
            console.log(findIndex);
            sendCharacter.results.splice(findIndex, 1, character);
            this.CharctersInfo$.next(sendCharacter);
            return;
          } else {
            let sendCharacter = this.userCharcters$.getValue();
            sendCharacter.push(character);
            this.userCharcters$.next(sendCharacter);
          }
        })
      );
  }

  editCharacter(character1: Character, userId: string) {
    let send = {
      Character: character1,
      userId: userId,
    };
    return this.http
      .post<Character>(
        'https://localhost:44309/api/characters/edit-character',
        send
      )
      .pipe(
        tap((character) => {
          console.log(character);
          if (character.originalId && character.originalId > 0) {
            let sendCharacter = this.CharctersInfo$.getValue();
            const findIndex = sendCharacter.results.findIndex(
              (ch) => ch.originalId == character.originalId
            );
            character.episode = character1.episode;
            console.log(character1);
            console.log(character);
            sendCharacter.results.splice(findIndex, 1, character);
            this.CharctersInfo$.next(sendCharacter);
            return;
          } else {
            let sendCharacter = this.userCharcters$.getValue();
            const findIndex = sendCharacter.findIndex(
              (ch) => ch.id == character.id
            );
            sendCharacter.splice(findIndex, 1, character);
            //sendCharacter.push(character);
            this.userCharcters$.next(sendCharacter);
          }
        })
      );
  }
  deleteCharacter(character: Character, userId: string) {
    let send = {
      Character: character,
      userId: userId,
    };
    return this.http
      .post<Character>(
        'https://localhost:44309/api/characters/delete-character',
        send
      )
      .pipe(
        tap((res) => {
          if (character.originalId && character.originalId != 0) {
            // original character
            let charactersUser = this.CharctersInfo$.getValue();
            const index = charactersUser.results.findIndex(
              (x) => x.originalId == character.originalId
            );
            charactersUser.results.splice(index, 1);
            this.CharctersInfo$.next(charactersUser);
            return;
          }
          // my character
          let charactersUser = this.userCharcters$.getValue();
          const index = charactersUser.findIndex((x) => x.id == character.id);
          charactersUser.splice(index, 1);
          this.userCharcters$.next(charactersUser);
        })
      );
  }

  resetCharacter(character: Character, userId: string) {
    let send = {
      Character: character,
      userId: userId,
    };
    return this.http
      .post<Character>(
        'https://localhost:44309/api/characters/reset-character',
        send
      )
      .pipe(
        switchMap((res) => {
          console.log(res);
          return this.getOriginalCharacterFromOriginalSeriese(
            character.originalId
          ).pipe(
            map((character: any) => {
              character.originalId = character.id;
              character.location = character.location.name;
              return character;
            })
          );
        }),
        tap((res) => {
          let charactersUser = this.CharctersInfo$.getValue();
          const index = charactersUser.results.findIndex(
            (x) => x.originalId == character.originalId
          );
          charactersUser.results.splice(index, 1, res);
          this.CharctersInfo$.next(charactersUser);
          return;
        })
      );
  }

  deletedCharcters(userId: string) {
    console.log('aaaaaaaaa');
    return this.http
      .get<number[]>(
        'https://localhost:44309/api/characters/deleted-characters-id/' + userId
      )
      .pipe(
        tap((res) => {
          console.log(res);
        }),
        switchMap((arrCharactersId) => {
          console.log(arrCharactersId);
          if (arrCharactersId.length == 0) return [];
          return this.getOriginalCharactersFromOriginalSeriese(arrCharactersId);
        })
      );
  }

  returnOriginalCharcters(characters: Character[], userId: string) {
    let send = {
      Characters: characters,
      userId: userId,
    };
    characters[0].location = characters[0].location.toString();
    return this.http
      .post<Character[]>(
        'https://localhost:44309/api/characters/reset-characters',
        send
      )
      .pipe(
        tap((res) => {
          let charactersInfo = this.CharctersInfo$.getValue();
          for (let i = 0; i < res.length; i++) {
            let index = charactersInfo.results.findIndex(
              (x) => x.originalId > res[i].id
            );
            console.log(res[i]);
            console.log(charactersInfo.results[index]);
            console.log(index);
            if (index != null && index >= 0) {
              if (index == 0) charactersInfo.results.splice(0, 0, res[i]);
              else charactersInfo.results.splice(index, 0, res[i]);
            }
          }
          this.CharctersInfo$.next(charactersInfo);
        })
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // Return an observable with a user-facing error message.
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
