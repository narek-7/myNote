import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css']
})
export class MyNoteComponent implements OnInit {

  noteEmail: string;

  constructor(
    private router: Router
  ) { }
  
  ngOnInit() {
    this.noteEmail = localStorage.getItem('Email');
  }

  logOut(){
    this.router.navigate(['/'])
  }

}
