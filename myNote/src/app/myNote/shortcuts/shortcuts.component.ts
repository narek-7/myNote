import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './../../database.service';

@Component({
  selector: 'app-shortcuts',
  templateUrl: './shortcuts.component.html',
  styleUrls: ['./shortcuts.component.css'],
})
export class ShortcutsComponent implements OnInit {
  noteEmail: string;
  shortcutTag: Object = new Object();
  shortcutNote: Object = new Object();
  shortcutTagArr = new Array();
  shortcutNoteArr = new Array();
  notesCurrentIndex = -1;
  tagsCurrentIndex = -1;

  constructor(private database: DatabaseService, private router: Router) {}

  ngOnInit() {
    this.noteEmail = window.localStorage.getItem('Email');
    this.shortcutTag = this.database.getTagShortcut(this.noteEmail);
    this.shortcutNote = this.database.getNoteShortcut(this.noteEmail);
    this.shortcutTagArr = Object.values(this.shortcutTag);
    this.shortcutNoteArr = Object.values(this.shortcutNote);
  }

  selectNote(idx) {
    this.tagsCurrentIndex = -1;
    this.notesCurrentIndex = idx;
  }

  selectTag(idx) {
    this.notesCurrentIndex = -1;
    this.tagsCurrentIndex = idx;
  }

  cancelRederect() {
    this.notesCurrentIndex = -1;
    this.tagsCurrentIndex = -1;
  }

  modifyTitleName(title: string) {
    if (title.length > 15) {
      return title.slice(0, 15) + '...';
    }
    return title;
  }

  rederect() {
    if (this.notesCurrentIndex != -1) {
      let idArr = Object.keys(this.shortcutNote);
      let idx: string = idArr[this.notesCurrentIndex];
      this.router.navigate(['/myNote/notes/'], {
        queryParams: { idNote: idx },
      });
    }
    if (this.tagsCurrentIndex != -1) {
      let idArr = Object.keys(this.shortcutTag);
      let idx = idArr[this.tagsCurrentIndex];
      this.router.navigate(['/myNote/tags/'], {
        queryParams: { idTag: idx },
      });
    }
  }
}
