import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from '../../services/auth.service';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  user?:User | null;
  constructor(public dialog: MatDialog, private authService: AuthService,private characterService: CharacterService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
       this.user = user;
    });
    this.authService.autoLoging();
  }
  ngOnDestroy(): void {
    this.destroy$.next(false);
  }

  openDialog(): void {
    if(this.user){
      this.authService.Out();
      this.characterService.getCharacters().subscribe(res=>{
        console.log(res);
        // this.characterService.CharctersInfo$.next(res);
        this.characterService.userCharcters$.next([]);

      });
      return;
    }


    console.log('The dialog was open');
    const dialogRef = this.dialog.open(DialogUser, {
      //   data: {name: this.name, animal: this.animal},
      width: '60%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-user.component.html',
  styleUrls: ['./dialog-user.component.css'],

  // standalone: true,
})
export class DialogUser implements OnInit, OnDestroy {
  user$: User;
  destroy$ = new Subject();
  hide1 = true;
  hide2 = true;
  isLoginMode = true;
  authForm: FormGroup;
  passwordPass: Boolean;
  currentPass: string;

  constructor(
    public dialogRef: MatDialogRef<DialogUser>,
    private authService: AuthService,
    private characterService: CharacterService,
    @Inject(MAT_DIALOG_DATA) public data: { s: number }
  ) {}
  ngOnInit(): void {
    this.initForm();
    this.authForm.controls['passwordCheck'].valueChanges.subscribe((val) => {
      if (val !== this.authForm.controls['password'].value) {
        this.authForm.controls['passwordCheck'].setErrors({ incorrect: null });
      }
    });

    this.authService.user$.subscribe((user) => {
      if (user) this.user$ = user;
    });
  }

  initForm() {
    this.authForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      passwordCheck: new FormControl(''),
    });
  }

  onSubmit() {
    console.log(this.authForm );
    // if(!this.authForm.valid){
    //   console.log('erorr');
    //   return;
    // }
    const password = this.authForm.get('password')?.value;
    const passwordCheck = this.authForm.get('passwordCheck')?.value;
    // const password=this.authForm.value.password;
    // const passwordCheck=this.authForm.value.password;
    if (password !== passwordCheck && !this.isLoginMode) {
      console.log('password not much');
      return;
    }
    console.log(this.authForm);
    let authObs: Observable<any>;
    if (this.isLoginMode) {
      authObs = this.authService.getUser(
        this.authForm.value.name,
        this.authForm.value.password
      );
    } else {
      authObs = this.authService.addUser(
        this.authForm.value.name,
        this.authForm.value.password
      );
    }
    console.log('why');
    authObs.pipe(takeUntil(this.destroy$)).subscribe(
      (res) => {
        console.log(res);
        this.characterService.getCharacters().subscribe(res=>{
          console.log(res);
        });
        this.dialogRef.close();
        // this.router.navigateByUrl('/management-add-product');
      },
      (err) => {
        // this.errMassage = err;
        console.log(err.error);
        //
      }
    );
      // this.dialogRef.close();
    //console.log(form.value.name);
  }
  changeMode() {
    this.isLoginMode = this.isLoginMode ? false : true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
  }
}
