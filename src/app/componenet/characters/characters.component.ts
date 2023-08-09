import { Component, HostListener, OnInit } from '@angular/core';
import { CharacterService } from '../../services/character.service';
import { Iinfo, Character } from '../../models/character';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css'],
})
export class CharactersComponent implements OnInit {
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: any) {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    const pageH = document.documentElement.scrollHeight;
    const scrollH = document.documentElement.offsetHeight;

    const sof = (pageH * 99) / 100; //% of pageH(where the scroller get there)
    const scrollPositionBottom = scrollPosition + scrollH;
    if (scrollPositionBottom > sof) {
      // console.log( scrollH);
      // console.log( pageH);
      // console.log(scrollPosition);
      if (this.info && this.info.next) {
        // let page=+(this.info.next[this.info.next.length-1]);
        // console.log(page);
        this.characterService.getCharacterbyPagt(this.info.next).subscribe();
        // this.characterService.getFilmsFilters(page).subscribe();
      }
    }
  }

  species = [];
  charactersOriginal: Character[] = [];
  charactersUser: Character[] = [];
  charactersList: Character[] = [];
  info: Iinfo;
  combinationArr = [];
  page = 1;
  user: User | null;
  constructor(
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((User) => {
      this.user = User;
    });

    this.characterService.getCharacters().subscribe();

    this.characterService.CharctersInfo$.subscribe((res) => {
      if (!res) return;
      console.log(res);
      this.info = res.info;
      this.charactersOriginal=res.results;
      // this.charactersList = res.results;
      this.charactersList = this.charactersUser.concat(this.charactersOriginal);
    });


    this.characterService.userCharcters$.subscribe((characters) => {
      if (!characters) return;
      this.charactersUser=characters;
      this.charactersList = characters.concat(this.charactersOriginal);
    });

    const inputArray = [2, 4, 6, 3, 7, 5, 2, 9];
    const targetNumber = 10;
    // const result = this.AllCombinationOfNumber(inputArray, 12);
    this.shtibel(inputArray, 10);
    // this.findAllCombinationLength(inputArray,4);

    // console.log(result);
  }

  shtibel(arr: number[], sum: number) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] + arr[j] == sum) {
          console.log(arr[i] + ' ' + arr[j] + '  = ' + sum);
        }
      }
    }
  }

  AllCombinationOfNumber(r: number[], number?: number) {
    let array = r;
    for (let i = 0; i < r.length; i++) {
      this.findAllCombinationLength(array, i + 2, number);
    }
  }
  // log all the sums of 5
  findAllCombinationLength(
    r: number[],
    sumNumberLength: number,
    shum?: number
  ) {
    let array = r;

    if (sumNumberLength > r.length || sumNumberLength <= 1) {
      console.log('dosnt have');
      return;
    }
    if (sumNumberLength == 2) {
      this.f(array, 0, shum);
      return;
    }
    for (let i = 0; i <= r.length; i++) {
      this.f(array, sumNumberLength - 2, shum);
      // console.log(array)
      array = array.slice(1);
    }
  }

  f(r: number[], start: number, shum?: number) {
    // start=2;
    let next = start;
    for (let i = 0; i < r.length - start - 1; i++) {
      // str+=r[i]+' ';
      this.f2(r, start, next, shum);
      console.log('------------');
      next++;
    }
  }
  f2(r: number[], sum: number, next: number, chekShum?: number) {
    let add = next + 1;
    while (true) {
      let str = '';
      let shum = 0;
      if (add >= r.length) break;

      for (let i = 0; i < sum; i++) {
        str += r[i] + '+';
        shum += r[i];
      }

      str += r[next] + '+';
      shum += r[next];

      str += r[add];
      shum += r[add];

      add++;

      if (chekShum) {
        if (chekShum === shum) {
          console.log(str + ' = ' + shum);
          // console.log(str);
        }
      } else {
        console.log(str + '= ' + shum);
      }
    }
  }
}
