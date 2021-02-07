import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MyNoteComponent } from './myNote/myNote.component';
import { NotesComponent } from './myNote/notes/notes.component';
import { CommonModule } from '@angular/common';
import { ShortcutsComponent } from './myNote/shortcuts/shortcuts.component';
import { TagsComponent } from './myNote/tags/tags.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    MyNoteComponent,
    NotesComponent,
    ShortcutsComponent,
    TagsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
