import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from './../../model/note';
import { DatabaseService } from './../../database.service';
import { AuthService } from './../../auth.service';
import { Tag } from './../../model/tag';
declare var $: any;

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css'],
})
export class NotesComponent implements OnInit {
  noteEmail: string;
  noteList: Array<Note>;
  tagList: Array<Tag>;
  note: Note = new Note();
  canCreateNote: boolean = true;
  currentIndex: number = -1;
  deletedObjectType: String = 'note';
  deletedObjectName: String = '';
  deletedObject = false;

  @ViewChild('text') text: ElementRef<any> = null;
  @ViewChild('title') title: ElementRef<any> = null;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.canCreateNote = true;
    this.noteEmail = window.localStorage.getItem('Email');
    this.noteList = this.database.getNotes(this.noteEmail);
    this.tagList = this.database.getTags(this.noteEmail);

    console.log('NoteList', this.noteList);
    console.log('UserList', localStorage.getItem('users'));
  }

  newNote() {
    this.canCreateNote = false;
    this.title.nativeElement.value = 'Untitle';
    this.text.nativeElement.value = '';
  }

  cancelSave() {
    this.canCreateNote = true;
    this.currentIndex = -1;
  }

  modifyTitleName(title: string) {
    if (title.length > 20) {
      return title.slice(0, 15) + '...';
    }
    return title;
  }

  saveNote() {
    if (this.currentIndex === -1) {
      this.cretaeNote();
    } else {
      this.changeExistingNote();
    }
    this.canCreateNote = true;
  }

  changeExistingNote() {
    this.noteList[this.currentIndex].title = this.title.nativeElement.value;
    this.noteList[this.currentIndex].text = this.text.nativeElement.value;
    this.noteList[this.currentIndex].modifiedDate = new Date();
    this.database.saveNotes(this.noteEmail, this.noteList);
    this.currentIndex = -1;
  }

  cretaeNote() {
    this.note.title = this.title.nativeElement.value;
    this.note.text = this.text.nativeElement.value;
    this.note.createdDate = new Date();
    this.note.modifiedDate = new Date();
    this.note.id = this.createID();
    this.noteList.push(this.note);
    this.addTagsInNote(this.note.id);
    this.database.saveNotes(this.noteEmail, this.noteList);
    this.note = new Note();
  }

  createID() {
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += Math.floor(10 * Math.random());
    }
    return id;
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

  showModal() {
    $('#myModal').modal('show');
  }

  hideModal(i) {
    let param = this.route.snapshot.queryParamMap.get('deletedObject');
    if (param === 'true') {
      this.noteList.splice(i, 1);
      this.database.saveNotes(this.noteEmail, this.noteList);
    }
    setTimeout(() => {
      location.reload();
    }, 300);
  }

  deleteNote(i) {
    this.deletedObjectType = 'note';
    this.deletedObjectName = this.noteList[i].title;
    this.showModal();
    $('#myModal').on('hide.bs.modal', () => {
      this.hideModal(i);
    });
  }

  addTagsInNote(noteId) {
    let map = this.database.getTagsInNote(this.noteEmail);
    map[noteId] = [];
    this.database.saveTagsInNote(this.noteEmail, map);
    let a = window.localStorage.getItem('TagsInNote');
    console.log(a);
  }

  connectTagToNote(idx) {
    let currentNoteId = this.noteList[this.currentIndex].id;
    let map = this.database.getTagsInNote(this.noteEmail);
    map[currentNoteId].push(this.tagList[idx].id);
    this.database.saveTagsInNote(this.noteEmail, map);
  }
}
