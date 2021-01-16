import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './../database.service';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css']
})
export class MyNoteComponent implements OnInit {

  noteEmail: string;

  constructor(
    private router: Router,
    private database: DatabaseService,
  ) { }

  ngOnInit() {
    this.noteEmail = localStorage.getItem('Email');
    let notesList = this.database.getNotes(this.noteEmail)

  }

  logOut(){
    this.router.navigate(['/'])
  }

}
