import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css']
})
export class MyNoteComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  logOut(){
    this.router.navigate(['/'])
  }

}
