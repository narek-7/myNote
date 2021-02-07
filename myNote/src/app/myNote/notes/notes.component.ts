import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from './../../model/note';
import { DatabaseService } from './../../database.service';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  noteEmail: string;
  noteList: Array<Note>;
  note: Note = new Note();
  canCreateNote: boolean = true;
  currentIndex: number = -1;

  @ViewChild('text') text: ElementRef<any> = null;
  @ViewChild('title') title: ElementRef<any> = null;

  constructor(private router: Router, private database: DatabaseService) {}

  ngOnInit() {
    this.canCreateNote = true;
    this.noteEmail = window.localStorage.getItem('Email');
    this.noteList = this.database.getNotes(this.noteEmail);
    console.log('NoteList', this.noteList);
    console.log('UserList', localStorage.getItem('users'));
  }

  logOut() {
    this.router.navigate(['/']);
  }

  saveNote() {
    if (this.currentIndex === -1) {
      this.note.title = this.title.nativeElement.value;
      this.note.text = this.text.nativeElement.value;
      this.note.createdDate = new Date();
      this.note.modifiedDate = new Date();
      this.note.id = this.note.createdDate.toString();
      this.noteList.push(this.note);
      this.database.saveNotes(this.noteEmail, this.noteList);
      this.note = new Note();
      this.canCreateNote = true;
    } else {
      this.noteList[this.currentIndex].title = this.title.nativeElement.value;
      this.noteList[this.currentIndex].text = this.text.nativeElement.value;
      this.noteList[this.currentIndex].modifiedDate = new Date();
      this.database.saveNotes(this.noteEmail, this.noteList);
      this.currentIndex = -1;
      this.canCreateNote = true;
    }
  }

  mouseOverNote(index) {
    if (this.currentIndex === -1) {
      this.canCreateNote = false;
      setTimeout(() => {
        this.title.nativeElement.value = this.noteList[index].title;
        this.text.nativeElement.value = this.noteList[index].text;
      }, 10);
    }
  }

  mouseOutNote() {
    if (this.currentIndex === -1) {
      this.canCreateNote = true;
    }
  }

  modifyNote(i) {
    this.currentIndex = i;
    this.title.nativeElement.value = this.noteList[i].title;
    this.text.nativeElement.value = this.noteList[i].text;
  }

  cancelSave() {
    this.canCreateNote = true;
    this.currentIndex = -1;
  }

  deleteNote(i) {
    this.noteList.splice(i, 1);
    this.database.saveNotes(this.noteEmail, this.noteList);
    this.canCreateNote = true;
    this.currentIndex = -1;
  }
}
