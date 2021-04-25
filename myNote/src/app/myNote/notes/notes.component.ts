import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
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
  currentNoteTagList: Array<Tag> = [];
  note: Note = new Note();
  canCreateNote: boolean = true;
  currentIndex: number = -1;
  previewNote: boolean = false;
  delObjType: String = 'note';
  delObjName: String = '';
  deletedObject = false;
  showAlert: boolean = false;
  query: string = '';
  textSizeArray: Array<string> = [
    '14',
    '18',
    '20',
    '22',
    '24',
    '26',
    '28',
    '30',
    '34',
    '38',
    '42',
    '46',
    '50',
  ];
  textColorArray: Array<string> = [
    'brown',
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'gray',
    'black',
  ];

  textFontArray: Array<string> = [
    'Calibri Light',
    'Palatino Linotype',
    'Book Antiqua',
    'Times New Roman',
    'Arial',
    'Arial Black',
    'Lucida Sans Unicode',
    'Tahoma',
    'Verdana',
    'Georgia',
    'Courier New',
  ];

  backgroundColorArray = [
    'AliceBlue',
    'MintCream',
    'Honeydew',
    'LightCyan',
    'lavenderblush',
    'Seashell',
    'Ivory',
    'GhostWhite',
    'Azure',
  ];

  @ViewChild('text') text: ElementRef<any> = null;
  @ViewChild('title') title: ElementRef<any> = null;
  @ViewChild('search') search: ElementRef<any> = null;

  constructor(
    private database: DatabaseService,
    private router: Router,
    private route: ActivatedRoute,
    private r: Renderer2
  ) {}

  ngOnInit() {
    this.showAlert = false;
    this.canCreateNote = true;
    this.currentIndex = -1;
    this.noteEmail = window.localStorage.getItem('Email');
    this.noteList = this.database.getNotes(this.noteEmail);
    this.tagList = this.database.getTags(this.noteEmail);
    this.updateTagsOfCurrentNote();
    this.checkRestoredNotes();
    this.route.queryParams.subscribe((params) => {
      return new Promise((resolve, reject) => {
        this.showNote(params.idNote);
        if (params.idNote) resolve(this.currentIndex);
        else reject('No selected notes');
      })
        .then((index) => this.completeData(index))
        .catch((error) => console.log('Error:', error));
    });

    console.log('NoteList', this.noteList);
    // let sub = this.database.restoredNote.subscribe((note) => {
    //   if (note) {
    //     console.log(note);
    //     //this.restoreNote(note);
    //     sub.unsubscribe;
    //   }
    // });
    // let users = this.database.getAllItems('users');
    // console.log('user', users);
  }

  addquerryParam(idx) {
    this.currentIndex = idx;
    let id = this.noteList[idx].id;
    this.router.navigate(['/myNote', 'notes'], { queryParams: { idNote: id } });
  }

  showNote(id) {
    let idx = -1;
    if (!id) {
      this.canCreateNote = true;
      this.currentIndex = -1;
      return;
    }
    if (this.currentIndex === -1) {
      idx = this.noteList.findIndex((value) => {
        return value.id === id;
      });
      this.currentIndex = idx;
    }
    this.canCreateNote = false;
    idx = this.currentIndex;
  }

  completeData(idx) {
    this.title.nativeElement.value = this.noteList[idx].title;
    this.text.nativeElement.value = this.noteList[idx].text;
    this.applyStylesToNote(idx);
    this.updateTagsOfCurrentNote();
  }

  checkRestoredNotes() {
    let rList = this.database.getRestoredNotes(this.noteEmail);
    if (rList.length) {
      this.noteList = this.database.getNotes(this.noteEmail);
      for (let i of rList) {
        this.noteList.push(i);
        this.addTagsArrayAtNoteCreation(i.id);
      }
      this.database.saveNotes(this.noteEmail, this.noteList);
      this.database.saveRestoredNotes(this.noteEmail, new Array());
    }
  }

  // restoreNote(note: Note) {
  //   let nList = this.database.getNotes(this.noteEmail);
  //   nList.push(note);
  //   this.addTagsArrayAtNoteCreation(note.id);
  //   this.database.saveNotes(this.noteEmail, nList);
  //   console.log(note, this.noteEmail);
  // }

  searching() {
    this.cancelSave();
    this.noteList = this.database.getNotes(this.noteEmail);
    if (this.query) {
      this.noteList = this.noteList.filter((n: Note) => {
        let patt = new RegExp(this.query, 'gi');
        if (patt.test(n.title)) {
          return n;
        }
      });
    }
  }

  highlight(title) {
    if (this.query) {
      return title.replace(new RegExp(this.query, 'gi'), (a) => {
        return `<span class="highlightText">${(a = this.modifyTitleName(
          a
        ))}</span>`;
      });
    } else {
      return this.modifyTitleName(title);
    }
  }

  newNote() {
    this.cancelFilter();
    this.canCreateNote = false;
    this.title.nativeElement.value = 'Untitle';
    this.text.nativeElement.value = '';
    this.updateTagsOfCurrentNote();
    this.resetTextStyle();
  }

  cancelFilter() {
    this.search.nativeElement.value = '';
    this.query = '';
    this.noteList = this.database.getNotes(this.noteEmail);
  }

  cancelSave() {
    this.router.navigate(['/myNote', 'notes']);
    this.canCreateNote = true;
    this.currentIndex = -1;
    this.showAlert = false;
    this.currentNoteTagList = [];
  }

  modifyTitleName(title: string) {
    if (title.length > 13) {
      return title.slice(0, 13) + '...';
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
    let changedNoteId = this.noteList[this.currentIndex].id;
    let nList = this.database.getNotes(this.noteEmail);
    let index = nList.findIndex((n) => {
      return n.id === changedNoteId;
    });
    nList[index].title = this.title.nativeElement.value;
    nList[index].text = this.text.nativeElement.value;
    nList[index].modifiedDate = new Date();
    this.database.saveNotes(this.noteEmail, nList);
    this.cancelFilter();
    this.updateShortcut();
    this.currentIndex = -1;
    this.noteList = nList;
  }

  cretaeNote(): void {
    this.cancelFilter();
    this.noteList = this.database.getNotes(this.noteEmail);
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
    this.previewNote = true;
    if (this.currentIndex === -1) {
      this.canCreateNote = false;
      setTimeout(() => {
        this.title.nativeElement.value = this.noteList[index].title;
        this.text.nativeElement.value = this.noteList[index].text;
        this.updateTagsOfCurrentNote(index);
        this.applyStylesToNote(index);
      }, 10);
    }
  }

  mouseOutNote() {
    this.previewNote = false;
    if (this.currentIndex === -1) {
      this.canCreateNote = true;
    }
  }
  applyStylesToNote(index) {
    this.resetTextStyle();
    let id = this.noteList[index].id;
    let nStyle: Map<string, any> = this.database.getNoteStyle(this.noteEmail);
    if (nStyle[id]) {
      let v = Object.values(nStyle[id]);
      let k = Object.keys(nStyle[id]);
      for (let i = 0; i < v.length; i++) {
        this.r.setStyle(this.text.nativeElement, k[i], v[i]);
      }
    }
  }

  resetTextStyle() {
    this.r.setStyle(this.text.nativeElement, 'fontWeight', null);
    this.r.setStyle(this.text.nativeElement, 'fontStyle', null);
    this.r.setStyle(this.text.nativeElement, 'fontSize', null);
    this.r.setStyle(this.text.nativeElement, 'color', null);
    this.r.setStyle(this.text.nativeElement, 'fontAlign', null);
    this.r.setStyle(this.text.nativeElement, 'fontFamily', null);
    this.r.setStyle(this.text.nativeElement, 'backgroundColor', null);
    this.r.setStyle(this.text.nativeElement, 'textDecorationLine', null);
  }

  showModal() {
    $('#myModal').modal('show');
  }

  hideModal(idx) {
    let param = this.route.snapshot.queryParamMap.get('deletedObject');
    if (param === 'true') {
      let delNoteId = this.noteList[idx].id;
      this.deleteNoteShortcut(delNoteId);
      this.throwNoteInTheTrash(delNoteId, idx);
      this.deleteNoteFromEveryTag(idx);
      this.deleteTagsArrayInNote(delNoteId);
      let nList = this.database.getNotes(this.noteEmail);
      let index = nList.findIndex((n: Note) => {
        return n.id === delNoteId;
      });
      nList.splice(index, 1);
      this.database.saveNotes(this.noteEmail, nList);
      this.cancelSave();
      this.search.nativeElement.value = null;
      this.noteList = nList;
    }
  }

  throwNoteInTheTrash(id: string, idx: number) {
    let deletedNote: Note = this.noteList[idx];
    let deletedNoteTagList: Tag[] = this.database.getTagsInNote(this.noteEmail)[
      id
    ];
    let map = this.database.getNoteFromTrash(this.noteEmail);
    map[id] = {
      note: deletedNote,
      tagList: deletedNoteTagList,
    };
    this.database.saveNoteInTrash(this.noteEmail, map);
  }

  deleteNote(idx) {
    this.delObjType = 'note';
    this.delObjName = this.noteList[idx].title;
    this.showModal();
    $('#myModal').on('hide.bs.modal', () => {
      this.hideModal(idx);
      $('#myModal').off('hide.bs.modal');
    });
  }

  deleteNoteShortcut(id) {
    let map = this.database.getNoteShortcut(this.noteEmail);
    if (map[id]) {
      delete map[id];
      this.database.saveNoteShortcut(this.noteEmail, map);
    }
    return;
  }

  addTagsArrayAtNoteCreation(noteId) {
    let map = this.database.getTagsInNote(this.noteEmail);
    map[noteId] = [];
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  deleteTagsArrayInNote(id) {
    let map = this.database.getTagsInNote(this.noteEmail);
    delete map[id];
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  connectTagWithNote(idx) {
    this.connectTagToNote(idx);
    this.connectNoteToTag(idx);
    this.updateTagsOfCurrentNote();
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
    let note = this.noteList[this.currentIndex];
    let map = this.database.getNotesInTag(this.noteEmail);
    let arr = map[tagId];
    for (let i in arr) {
      if (arr[i].id === note.id) return;
    }
    map[tagId].push(note);
    this.database.saveNotesInTag(this.noteEmail, map);
  }

  updateTagsOfCurrentNote(index?) {
    if (!(index + 1)) {
      index = this.currentIndex;
    }
    if (index != -1) {
      let currentNoteId = this.noteList[index].id;
      this.currentNoteTagList = this.database.getTagsInNote(this.noteEmail)[
        currentNoteId
      ];
    } else {
      this.currentNoteTagList = [];
    }
  }

  deleteNoteFromEveryTag(idx) {
    this.updateTagsOfCurrentNote();
    if (this.currentNoteTagList) {
      let tagIdArr;
      let Map = this.database.getNotesInTag(this.noteEmail);
      tagIdArr = this.currentNoteTagList.map((t: Tag) => {
        return t.id;
      });
      for (let i in tagIdArr) {
        Map[tagIdArr[i]] = Map[tagIdArr[i]].filter((n: Note) => {
          if (n.id != this.noteList[idx].id) return n;
        });
      }
      this.database.saveNotesInTag(this.noteEmail, Map);
    }
  }

  deleteAllConnectionsTagAndNote(idx) {
    this.deleteTagFromTheNote(idx);
    this.deleteNoteFromTheTag(idx);
    this.updateTagsOfCurrentNote();
  }

  deleteTagFromTheNote(idx) {
    let currentNoteId = this.noteList[this.currentIndex].id;
    let map = this.database.getTagsInNote(this.noteEmail);
    map[currentNoteId].splice(idx, 1);
    this.database.saveTagsInNote(this.noteEmail, map);
  }

  deleteNoteFromTheTag(idx) {
    let deletedNoteId = this.noteList[this.currentIndex].id;
    let deletedTagId = this.currentNoteTagList[idx].id;
    let map = this.database.getNotesInTag(this.noteEmail);
    for (let i in map[deletedTagId]) {
      if (map[deletedTagId][i].id === deletedNoteId) {
        map[deletedTagId].splice(i, 1);
        this.database.saveNotesInTag(this.noteEmail, map);
        return;
      }
    }
  }

  shortcut(id) {
    let map = this.database.getNoteShortcut(this.noteEmail);
    if (map[id]) {
      return '../assets/images/star1.png';
    }
    return '../assets/images/star4.png';
  }

  addCancelShortcut(id, idx) {
    let map = this.database.getNoteShortcut(this.noteEmail);
    if (!map[id]) {
      map[id] = this.noteList[idx].title;
    } else {
      delete map[id];
    }
    this.database.saveNoteShortcut(this.noteEmail, map);
    console.log(map);
  }

  updateShortcut() {
    let nShortcut = this.database.getNoteShortcut(this.noteEmail);
    let noteList = this.database.getNotes(this.noteEmail);
    console.log(noteList);
    noteList.map((s) => {
      if (nShortcut[s.id]) {
        nShortcut[s.id] = s.title;
      }
    });
    this.database.saveNoteShortcut(this.noteEmail, nShortcut);
  }

  textStyle(tStyle: string) {
    if (this.currentIndex != -1) {
      let map = this.database.getNoteStyle(this.noteEmail);
      let id = this.noteList[this.currentIndex].id;
      if (!map[id]) {
        map[id] = new Map();
      }
      switch (tStyle) {
        case 'bold':
          map[id].fontWeight
            ? (map[id].fontWeight = null)
            : (map[id].fontWeight = 'bold');
          break;
        case 'italic':
          map[id].fontStyle
            ? (map[id].fontStyle = null)
            : (map[id].fontStyle = 'italic');
          break;
        case 'underline':
          map[id].textDecorationLine
            ? (map[id].textDecorationLine = null)
            : (map[id].textDecorationLine = 'underline');
          break;
        case 'left':
          map[id].textAlign = 'left';
          break;
        case 'center':
          map[id].textAlign = 'center';
          break;
        case 'right':
          map[id].textAlign = 'right';
          break;
      }
      this.database.saveNoteStyle(this.noteEmail, map);
      this.applyStylesToNote(this.currentIndex);
      console.log(map);
    }
  }

  textSize(tSize: string) {
    if (this.currentIndex != -1) {
      let map = this.database.getNoteStyle(this.noteEmail);
      let id = this.noteList[this.currentIndex].id;
      if (!map[id]) {
        map[id] = new Map();
      }
      console.log(map);
      map[id].fontSize = tSize + 'px';
      this.database.saveNoteStyle(this.noteEmail, map);
      this.applyStylesToNote(this.currentIndex);
    }
  }

  textColor(tColor) {
    if (this.currentIndex != -1) {
      let map = this.database.getNoteStyle(this.noteEmail);
      let id = this.noteList[this.currentIndex].id;
      if (!map[id]) {
        map[id] = new Map();
      }
      console.log(map);
      map[id].color = tColor;
      this.database.saveNoteStyle(this.noteEmail, map);
      this.applyStylesToNote(this.currentIndex);
    }
  }

  textFont(tFont) {
    if (this.currentIndex != -1) {
      let map = this.database.getNoteStyle(this.noteEmail);
      let id = this.noteList[this.currentIndex].id;
      if (!map[id]) {
        map[id] = new Map();
      }
      console.log(map);
      map[id].fontFamily = tFont;
      this.database.saveNoteStyle(this.noteEmail, map);
      this.applyStylesToNote(this.currentIndex);
    }
  }

  backgroundColor(bColor) {
    if (this.currentIndex != -1) {
      let map = this.database.getNoteStyle(this.noteEmail);
      let id = this.noteList[this.currentIndex].id;
      if (!map[id]) {
        map[id] = new Map();
      }
      console.log(map);
      map[id].backgroundColor = bColor;
      this.database.saveNoteStyle(this.noteEmail, map);
      this.applyStylesToNote(this.currentIndex);
    }
  }
}
