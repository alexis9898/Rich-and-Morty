import { HostListener, Injectable } from '@angular/core';
import { tap, map, BehaviorSubject, catchError, throwError, Observable, take} from 'rxjs';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
// import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Icharacter, Iinfo, Character } from '../models/character';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  // charcters$ = new BehaviorSubject<character[]>([]);
  CharctersInfo$ = new BehaviorSubject<Icharacter | null>(null);
  userCharcters$ = new BehaviorSubject<Character[]>([]);
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
    return this.http
      .get<Icharacter>('https://rickandmortyapi.com/api/character')
      .pipe(
        tap((res) => {
          let user = this.authService.user$.getValue();
          if (!user) {
            this.CharctersInfo$.next(res);
            return;
          }
          let userId = user.id;
          console.log(userId);
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

  getCharactersFilters(page: number, species?: string) {
    let url = 'https://rickandmortyapi.com/api/character/?';
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
    return this.http.get<Icharacter>(url).pipe(
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
            this.getUserCharacters(userId, species).subscribe();
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
            let userCharacters=this.userCharcters$.getValue();
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

  getUserCharacters(userId: string, spicies?: string) {
    return this.http
      .get<Character[]>(
        'https://localhost:44309/api/characters/charcters-my-server/' +
          userId +
          '/' +
          spicies
      )
      .pipe(
        tap((characters) => {
          this.userCharcters$.next(characters);
        })
      );
  }

  getOriginalCharacterFromMySql(character: Character, userId: string){
    let send = {
      Character: character,
      userId: userId,
    };
    // if(!character || !character.originalId || character.originalId==0)
    //   return null;
    console.log(send);
    return this.http
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

  editCharacter(character: Character, userId: string) {
    let send = {
      Character: character,
      userId: userId,
    };
    return this.http
    .post<Character>(
      'https://localhost:44309/api/characters/edit-character',
      send
    ).pipe(tap(character=>{
      console.log(character);
      if (character.originalId && character.originalId>0) {
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
        const findIndex = sendCharacter.findIndex(
          (ch) => ch.id == character.id
        );
        sendCharacter.splice(findIndex, 1, character);
        //sendCharacter.push(character);
        this.userCharcters$.next(sendCharacter);
      }
    }));
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
    ).pipe(
      tap(res=>{
        if(character.originalId && character.originalId!=0){ // original character
          let charactersUser=this.CharctersInfo$.getValue();
          const index= charactersUser.results.findIndex(x=>x.originalId==character.originalId);
          charactersUser.results.splice(index,1);
          this.CharctersInfo$.next(charactersUser);
          return;
        }
        // my character
        let charactersUser=this.userCharcters$.getValue();
        const index= charactersUser.findIndex(x=>x.id==character.id);
        charactersUser.splice(index,1);
        this.userCharcters$.next(charactersUser);
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }
}
