import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css']
})
export class MyNoteComponent implements OnInit {
  
  noteEmail: string;

  ngOnInit() {

    this.noteEmail = window.localStorage.getItem("Email");
  }
}
