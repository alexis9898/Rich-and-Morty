import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DialogUser } from '../user/user.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Character } from 'src/app/models/character';
import { SpeciesComponent } from '../species/species.component';
import { CharacterService } from 'src/app/services/character.service';
import { UnsubscribeComponent } from '../unsubscribe/unsubscribe.component';

@Component({
  selector: 'app-add-character',
  templateUrl: './add-character.component.html',
  styleUrls: ['./add-character.component.css'],
})
export class AddCharacterComponent {
  @Input('character') character: Character;

  destroy$ = new Subject();
  user?: User | null;
  constructor(public dialog: MatDialog, private authService: AuthService) {}

  ngOnInit(): void {
    console.log(this.character);

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
    const dialogRef = this.dialog.open(DialogEditCharacter, {
      width: '60%',
      data: this.character,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}

@Component({
  selector: 'dialog-add-character-dialog',
  templateUrl: 'dialog-add-character.component.html',
  styleUrls: ['./dialog-add-character.component.css'],
})
export class DialogEditCharacter
  extends UnsubscribeComponent
  implements OnInit
{
  spicies: string[];
  status: string[];
  user: User;
  characterForm: FormGroup;
  isThisOriginalChanged = false;
  image: string = 'https://rickandmortyapi.com/api/character/avatar/11.jpeg';
  editMode: boolean = false; //fall=add, true=updat
  // character:Character;
  locations: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogEditCharacter>,
    private authService: AuthService,
    private characterService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: Character
  ) {
    super();
  }
  ngOnInit(): void {
    this.spicies = this.characterService.spicies;
    this.status = this.characterService.status;
    console.log(this.data);
    this.editMode = this.data ? true : false;
    this.data
      ? (this.image = this.data.image == '' ? this.image : this.data.image)
      : null;
    this.authService.user$.pipe(takeUntil(this.unsub$)).subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
    // let locat = this.characterService.locations$.getValue();
    let locat = this.characterService.locations$.getValue();
    // console.log(locat);
    if (locat.length==0) {
      this.characterService.getAllLocationByPag('').subscribe();
    }else
      this.locations=locat;
    // this.locations= this.characterService.locations;
    this.characterService.locations$.subscribe((res) => {
     this.locations=res;
    });
    this.initForm();
  }

  initForm() {
    this.characterForm = new FormGroup({
      name: new FormControl(this.data ? this.data.name : '', [
        Validators.required,
      ]),
      spicies: new FormControl(this.data ? this.data.species : '', [
        Validators.required,
      ]),
      status: new FormControl(this.data ? this.data.status : '', [
        Validators.required,
      ]),
      location: new FormControl(this.data ? this.data.location : '', [
        Validators.required,
      ]),
    });

    // console.log(this.characterForm);
  }

  onSubmit() {
    if (!this.characterForm.valid) {
      console.log(this.characterForm);
      console.log('error');
      return;
    }
    let id, name, spicies, status, originalId, location, episode;
    id = this.data ? this.data.id : 0;
    originalId = this.data ? this.data.originalId : 0;
    name = this.characterForm.controls['name'].value;
    spicies = this.characterForm.controls['spicies'].value;
    status = this.characterForm.controls['status'].value;
    location = this.characterForm.controls['location'].value;
    episode = this.data ? this.data.episode : [];

    let character: Character = new Character(
      id,
      name,
      status,
      spicies,
      location,
      this.image,
      episode,
      originalId,
      null
    );

    this.editMode
      ? this.characterService.editCharacter(character, this.user.id).subscribe()
      : this.characterService.addCharacter(character, this.user.id).subscribe();
    this.dialogRef.close();
    // this.characterService.addCharacter(character)
  }

  removeCharacter() {
    if (!this.data || !this.user) return;
    this.characterService.deleteCharacter(this.data, this.user.id).subscribe();
    this.dialogRef.close();
  }

  resetOriginalCharaster() {
    if (!this.data || !this.user) return;
    this.characterService
      .resetCharacter(this.data, this.user.id)
      .subscribe((res) => {});
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
