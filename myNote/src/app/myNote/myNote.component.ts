import { Component, OnInit } from '@angular/core';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css'],
})
export class MyNoteComponent implements OnInit {
  constructor(private auth: AuthService) {}

  noteEmail: string;

  ngOnInit() {
    this.noteEmail = window.localStorage.getItem('Email');
  }

  logOut() {
    this.auth.logout();
  }
}
