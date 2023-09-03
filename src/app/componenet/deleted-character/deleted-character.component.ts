import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Character } from 'src/app/models/character';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-deleted-character',
  templateUrl: './deleted-character.component.html',
  styleUrls: ['./deleted-character.component.css']
})
export class DeletedCharacterComponent {


  destroy$ = new Subject();
  user?: User | null;
  constructor(public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    // console.log(this.character);

    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.authService.autoLoging();
  }
  ngOnDestroy(): void {
    this.destroy$.next(false);
  }

  openDialog(): void {
    console.log('The dialog was open');
    const dialogRef = this.dialog.open(deletedCharacterDialog, {
      width: '75%',
      height:'80%',

      // data: this.character,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}

@Component({
  selector: 'deleted-character-dialog.component',
  templateUrl: 'deleted-character-dialog.component.html',
  styleUrls: ['./deleted-character-dialog.component.css'],
})
export class deletedCharacterDialog  implements OnInit {

  deletedCharacters:Character[]=[];
  user:User
  constructor(
    public dialogRef: MatDialogRef<deletedCharacterDialog>,
    private authService: AuthService,
    private characterService: CharacterService,
    // @Inject(MAT_DIALOG_DATA) public data: Character
  ) {}
  ngOnInit(): void {

    this.authService.user$.subscribe(user=>{
      if(!user) return;
      this.characterService.deletedCharcters(user.id).subscribe(res=>{
        this.deletedCharacters=res;
      });
      this.user=user;
    });
  }
  returnAllCharacters(){
    console.log(this.deletedCharacters);
    this.characterService.returnOriginalCharcters(this.deletedCharacters,this.user.id).subscribe();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
