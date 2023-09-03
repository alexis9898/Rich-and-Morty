import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Character } from '../../models/character';
import { CharacterService } from 'src/app/services/character.service';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  search: FormControl = new FormControl();
  characterSearch:Character[];

  constructor( private characterService:CharacterService) {}

  ngOnInit(): void {
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      // if (value.length === 0 || value==='') {
      //   this.characterSearch=[];
      //   return;
      // }

      this.characterService.search(value);

      // this.characterService.getCharactersFilters(0,null,value).subscribe(character=>{
      //   // this.ch=filmsRes;
      //   // console.log(filmsRes);
      // });
    });
  }
}
