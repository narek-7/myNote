import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MyNoteComponent } from './myNote/myNote.component';
import { RegistrationComponent } from './registration/registration.component';
import { NotesComponent } from './myNote/notes/notes.component';
import { ShortcutsComponent } from './myNote/shortcuts/shortcuts.component';
import { TagsComponent } from './myNote/tags/tags.component';
import { TrashComponent } from './myNote/trash/trash.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registration', component: RegistrationComponent },
  {
    path: 'myNote',
    component: MyNoteComponent,
    children: [
      { path: 'notes', component: NotesComponent },
      { path: 'shortcuts', component: ShortcutsComponent },
      { path: 'tags', component: TagsComponent },
      { path: 'trash', component: TrashComponent },
      { path: '**', redirectTo: '/myNote/notes' },
    ],
  },
  { path: '**', redirectTo: '/myNote/notes' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
