import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Character } from 'src/app/models/character';
import { CharacterService } from '../../services/character.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user';
import { MatDialogRef } from '@angular/material/dialog';
import { deletedCharacterDialog } from '../deleted-character/deleted-character.component';

@Component({
  selector: 'app-deleted-character-cart',
  templateUrl: './deleted-character-cart.component.html',
  styleUrls: ['./deleted-character-cart.component.css']
})
export class DeletedCharacterCartComponent implements OnInit, OnDestroy {

  @Input('character') character:Character;
  user:User;
  constructor(private characterService:CharacterService,private authService:AuthService,public dialogRef: MatDialogRef<deletedCharacterDialog>) {

  }
  ngOnInit(): void {
    this.authService.user$.subscribe(user=>{
      if(!user) return;
      this.user=user;
    })
  }
  returnAllCharacters(){
    // this.characterService.returnOriginalCharcters()
  }
  ngOnDestroy(): void {

  }
  returnCharacter(){
    this.characterService.returnOriginalCharcters([this.character],this.user.id).subscribe();
    this.dialogRef.close();
  }

}
