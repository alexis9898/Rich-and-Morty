import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Character } from 'src/app/models/character';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DialogEditCharacter } from '../add-character/add-character.component';

@Component({
  selector: 'app-character-card',
  templateUrl: './character-card.component.html',
  styleUrls: ['./character-card.component.css']
})
export class CharacterCardComponent {
  @Input('character') character: Character;
  user:User;
  constructor(private authService: AuthService,public dialog: MatDialog) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user=>{
      this.user=user;
    });
  }

  changCharacter(){
    if(this.user)
      return;
  }
  openDialog(): void {
    console.log('The dialog was open');
    const dialogRef = this.dialog.open(DialogEditCharacter, {
      width: '60%',
      data:this.character
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
