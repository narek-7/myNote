import { Component, OnInit } from '@angular/core';
import { DatabaseService } from './../../database.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
})
export class TrashComponent implements OnInit {
  noteTrashList: Array<string> = [];
  noteEmail: string;
  canEmptyTrash: boolean = false;
  currentIndex: number = 1;

  constructor(private database: DatabaseService) {}

  ngOnInit() {
    this.noteEmail = window.localStorage.getItem('Email');
    this.makeNoteTrashList();
    console.log(this.noteTrashList);
  }

  deleteAllInTrash(){
    let M = new Map();
    this.database.saveNoteInTrash(this.noteEmail, M)
  }

  deleteNoteInTash(idx){

  }

  overviewNoteInTrash(idx){

  }

  makeNoteTrashList() {
    let M = new Map();
    M = this.database.getNoteFromTrash(this.noteEmail);
    for (let i in M) {
      this.noteTrashList.push(M[i].note);
    }
    //  M.forEach((key, value) => {
    //    this.noteTrashList.push(this.noteTrashList.push.key); //Ինչու՞ չի աշխատում սա
    //  });
  }
}
