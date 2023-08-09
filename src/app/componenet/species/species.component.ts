import { Component } from '@angular/core';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-species',
  templateUrl: './species.component.html',
  styleUrls: ['./species.component.css'],
})
export class SpeciesComponent {
  // spicies = [
  //   'Humanoid',
  //   'Alien',
  //   'unknown',
  //   'Human',
  //   'Poopybutthole',
  //   'Mythological Creature',
  //   'Animal',
  //   'Robot',
  //   'Cronenberg',
  //   'Disease',
  // ];
  spicies: string[];

  /**
   *
   */
  constructor(private characterService: CharacterService) {
    this.spicies = characterService.spicies;
  }
  selectedAllSpecies: boolean = true;
  selectedSpecies: string = '';

  selectAll() {
    this.selectedAllSpecies = true;
    this.selectedSpecies = '';
    this.characterService.getCharacters().subscribe();
  }

  selectSpecies(specie: string) {
    console.log(specie);
    this.selectedAllSpecies = false;
    this.selectedSpecies = specie;
    this.characterService.getCharactersFilters(1, specie).subscribe();
  }
}
