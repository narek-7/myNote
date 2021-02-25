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
  showAlert: boolean = false;

  @ViewChild('text') text: ElementRef<any> = null;
  @ViewChild('title') title: ElementRef<any> = null;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.showAlert = false;
    this.canCreateNote = true;
    this.noteEmail = window.localStorage.getItem('Email');
    this.noteList = this.database.getNotes(this.noteEmail);
    this.tagList = this.database.getTags(this.noteEmail);
    console.log('NoteList', this.noteList);               //ջնջել
    let a = window.localStorage.getItem('TagsInNote');   //ջնջել
    console.log(a);                                       //ջնջել
  }

  newNote() {
    this.canCreateNote = false;
    this.title.nativeElement.value = 'Untitle';
    this.text.nativeElement.value = '';
  }

  cancelSave() {
    this.canCreateNote = true;
    this.currentIndex = -1;
    this.showAlert = false;
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
    this.note.id = this.createId();
    this.noteList.push(this.note);
    this.addTagsArrayAtNoteCreation(this.note.id);
    this.database.saveNotes(this.noteEmail, this.noteList);
    this.note = new Note();
  }

  createId() {
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

  hideModal(idx) {
    let param = this.route.snapshot.queryParamMap.get('deletedObject');
    if (param === 'true') {
      //this.deleteNoteFromEveryTag(idx)
      this.deleteTagsInNote(idx);
      this.noteList.splice(idx, 1);
      this.database.saveNotes(this.noteEmail, this.noteList);
    }
    setTimeout(() => {
      // location.reload();
    }, 300);
  }

  deleteNoteFromEveryTag(idx){
    console.log(idx)
    // let noteId = this.noteList[idx].id;
    // let tagArr = this.database.getTagsInNote(this.noteEmail)[noteId];
    // console.log(tagArr)
    // for(let i in tagArr){
    // }
  }

  deleteNote(idx) {
    this.deletedObjectType = 'note';
    this.deletedObjectName = this.noteList[idx].title;
    this.showModal();
    $('#myModal').on('hide.bs.modal', () => {
      this.hideModal(idx);
    });
  }

  addTagsArrayAtNoteCreation(noteId) {
    let map = this.database.getTagsInNote(this.noteEmail);
    map[noteId] = [];
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  deleteTagsInNote(idx) {
    let deletedNoteId = this.noteList[idx].id;
    let map = this.database.getTagsInNote(this.noteEmail);
    delete map[deletedNoteId];
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  connectTagWithNote(idx) {
    this.connectTagToNote(idx);
    this.connectNoteToTag(idx);
  }

  connectTagToNote(idx) {
    let t: Tag = this.tagList[idx];
    let currentNoteId = this.noteList[this.currentIndex].id;
    let arr = this.database.getTagsInNote(this.noteEmail)[currentNoteId];
    for (let i in arr) {
      if (arr[i].id === t.id) {
        if (this.showAlert === true) {
          return;
        } else {
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 3000);
        }
        return;
      }
    }
    let map = this.database.getTagsInNote(this.noteEmail);
    map[currentNoteId].push(t);
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  connectNoteToTag(idx) {
    let tagId = this.tagList[idx].id;
    let map = this.database.getNotesInTag(this.noteEmail);
    let note = this.noteList[this.currentIndex];
    map[tagId].push(note);
    this.database.saveNotesInTag(this.noteEmail, map);
  }

  currentNoteTagList(): Array<string> {
    if (this.currentIndex != -1) {
      let currentNoteId = this.noteList[this.currentIndex].id;
      return this.database.getTagsInNote(this.noteEmail)[currentNoteId];
    }
  }

  deleteTagOfTheNote(idx) {
    let currentNoteId = this.noteList[this.currentIndex].id;
    let map = this.database.getTagsInNote(this.noteEmail);
    map[currentNoteId].splice(idx, 1);
    this.database.saveTagsInNote(this.noteEmail, map);
  }
}
