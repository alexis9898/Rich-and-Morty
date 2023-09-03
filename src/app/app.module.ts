import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componenet/header/header.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AngryBirdComponent } from './componenet/angry-bird/angry-bird.component';
import { CharactersComponent } from './componenet/characters/characters.component';
// import CharacterCartComponent from './componenet/character-cart/character-cart.component';
import { CharacterService } from './services/character.service';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DialogUser, UserComponent } from './componenet/user/user.component';
import { MatInputModule } from '@angular/material/input';
import { SpeciesComponent } from './componenet/species/species.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  AddCharacterComponent,
  DialogEditCharacter,
} from './componenet/add-character/add-character.component';
import { MatSelectModule } from '@angular/material/select';
import { CharacterCardComponent } from './componenet/character-card/character-card.component';
import { DeletedCharacterComponent,deletedCharacterDialog } from './componenet/deleted-character/deleted-character.component';
import { UnsubscribeComponent } from './componenet/unsubscribe/unsubscribe.component';
import { DeletedCharacterCartComponent } from './componenet/deleted-character-cart/deleted-character-cart.component';
import { TargilComponent } from './componenet/targil/targil.component';
import { SearchComponent } from './componenet/search/search.component';
// import {MatCardModule} from '@angular/material/card';
import {MatExpansionModule} from '@angular/material/expansion';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AngryBirdComponent,
    CharactersComponent,
    // CharacterCartComponent,
    UserComponent,
    DialogUser,
    SpeciesComponent,
    AddCharacterComponent,
    DialogEditCharacter,
    CharacterCardComponent,
    DeletedCharacterComponent,
    deletedCharacterDialog,
    DeletedCharacterCartComponent,
    TargilComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,

    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
