import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from './../../database.service';
import { Note } from './../../model/note';
import { Tag } from './../../model/tag';

@Component({
  selector: 'app-trash',
  templateUrl: './trash.component.html',
  styleUrls: ['./trash.component.css'],
})
export class TrashComponent implements OnInit {
  noteTrashList: Array<Note> = [];
  noteEmail: string;
  currentIndex: number = -1;
  actualNoteTagList: Array<Tag> = [];

  @ViewChild('title') title: ElementRef<any> = null;
  @ViewChild('text') text: ElementRef<any> = null;

  constructor(private database: DatabaseService) {}

  ngOnInit() {
    this.noteEmail = window.localStorage.getItem('Email');
    this.updateNoteTrashList();
    //console.log('noteTrashList', this.noteTrashList);
  }

  deleteAllInTrash() {
    let map = new Map();
    this.noteTrashList = [];
    this.database.saveNoteInTrash(this.noteEmail, map);
  }

  // restoreNote(idx) {
  //   let n: Note = this.noteTrashList[idx];
  //   this.database.restoredNote.emit(n);
  //   this.deleteNoteInTash(idx);
  // }

  restoreNote(idx) {
    let restArr: Note[] = this.database.getRestoredNotes(this.noteEmail);
    restArr.push(this.noteTrashList[idx]);
    this.database.saveRestoredNotes(this.noteEmail, restArr);
    this.deleteNoteFromTash(idx);
  }

  permanentRemoveNote(idx) {
    let actualId = this.noteTrashList[idx].id;
    this.deleteNoteStyles(actualId);
    this.deleteNoteFromTash(idx);
  }

  deleteNoteFromTash(idx) {
    let actualId = this.noteTrashList[idx].id;
    let map = this.database.getNoteFromTrash(this.noteEmail);
    delete map[actualId];
    this.database.saveNoteInTrash(this.noteEmail, map);
    this.updateNoteTrashList();
    this.cancelOverviewNote();
  }

  deleteNoteStyles(id) {
    let map = this.database.getNoteStyle(this.noteEmail);
    console.log(map[id]);
    if (map[id]) {
      delete map[id];
      this.database.saveNoteStyle(this.noteEmail, map);
    }
  }

  overviewNoteInTrash(idx) {
    this.currentIndex = idx;
    let actualNoteId = this.noteTrashList[idx].id;
    let map = this.database.getNoteFromTrash(this.noteEmail);
    this.title.nativeElement.value = this.noteTrashList[idx].title;
    this.text.nativeElement.value = this.noteTrashList[idx].text;
    this.actualNoteTagList = map[actualNoteId].tagList;
  }

  updateNoteTrashList() {
    let map = new Map();
    map = this.database.getNoteFromTrash(this.noteEmail);
    this.noteTrashList = [];
    for (let i in map) {
      this.noteTrashList.push(map[i].note);
    }
    //  M.forEach((key, value) => {
    //    this.noteTrashList.push(this.noteTrashList.push.key); //Ինչու՞ չի աշխատում սա
    //  });
  }

  cancelOverviewNote() {
    this.currentIndex = -1;
    this.actualNoteTagList = [];
  }
}
