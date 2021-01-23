import { Component, OnInit,  ViewChild, ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './../database.service';
import { Note } from './../model/note';

@Component({
  selector: 'app-myNote',
  templateUrl: './myNote.component.html',
  styleUrls: ['./myNote.component.css']
})
export class MyNoteComponent implements OnInit {

  noteEmail: string;
  noteList: Array<Note>;
  note: Note = new Note();
  canCreateNote: boolean = true;
  currentIndex: number = -1;

  @ViewChild('text') text: ElementRef<any> = null;
  @ViewChild('title') title: ElementRef<any> = null;

  constructor(
    private router: Router,
    private database: DatabaseService,
  ) {}

  ngOnInit() {
    this.canCreateNote = true;
    this.noteEmail = window.localStorage.getItem("Email");
    this.noteList = this.database.getNotes(this.noteEmail);
    console.log("NoteList",this.noteList)
    console.log("UserList",localStorage.getItem('users'))
  }

  logOut(){
    this.router.navigate(['/']);
  }

  saveNote(){
    this.note.title = this.title.nativeElement.value
    this.note.text = this.text.nativeElement.value
    this.note.createdDate = new Date();
    this.note.modifiedDate = new Date();
    this.noteList.push(this.note);
    this.database.saveNotes(this.noteEmail, this.noteList);
    this.noteList = this.database.getNotes(this.noteEmail);
    this.note = new Note();
    this.canCreateNote=true;
  }

  showNote(index){
    this.canCreateNote = false;
    setTimeout( () => {
    this.title.nativeElement.value = this.noteList[index].title;
    this.text.nativeElement.value = this.noteList[index].text;
    }, 10)
  }

  hideNote(){
    this.canCreateNote = true;
  }

  modifyNote(index){
    this.title.nativeElement.value = this.noteList[index].title;
    this.text.nativeElement.value = this.noteList[index].text;
  }

}
