import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from './../../database.service';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
})
export class TrashComponent implements OnInit {
  noteTrashList: Array<string> = [];
  noteEmail: string;
  currentIndex: number = -1;

  @ViewChild('title') title: ElementRef<string> = null;
  @ViewChild('text') text: ElementRef<string> = null;

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

  restoreNote(){

  }

  deleteNoteInTash(){

  }

  overviewNoteInTrash(idx){
    this.currentIndex = idx;
    console.log(this.noteTrashList[idx])

  }

  cancelOverviewNote(){
    this.currentIndex = -1;
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
