import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tag } from './../../model/tag';
import { Router } from '@angular/router';
import { DatabaseService } from './../../database.service';
import { Note } from './../../model/note';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  noteEmail: string;
  tagList: Array<Tag>;
  tag = new Tag();
  canCreateTag: boolean = true;
  currentIndex: number = -1;

  @ViewChild('name') name: ElementRef<any> = null;

  constructor(private router: Router, private database: DatabaseService) {}

  ngOnInit() {
    this.canCreateTag = true;
    this.noteEmail = window.localStorage.getItem('Email');
    this.tagList = this.database.getTags(this.noteEmail);
    console.log(this.tagList);                                  //ջնջել
    let a = window.localStorage.getItem('NotesInTag');          //ջնջել
    console.log(a);                                             //ջնջել
    // let a = new Map()
    // this.database.saveNotesInTag(this.noteEmail, a)

  }

  saveTag() {
    let val = this.name.nativeElement.value;
    if (val != '' && this.currentIndex === -1) {
      this.createTag();
    } else {
      if (val != '' && this.currentIndex != -1) {
        this.changeExistingTag();
      }
    }
    this.canCreateTag = true;
  }

  createTag() {
    let val = this.name.nativeElement.value;
    this.tag.name = val;
    this.tag.createdDate = new Date();
    this.tag.id = this.createID();
    this.tagList.push(this.tag);
    this.addNotesArrayAtTagCreation(this.tag.id);
    this.database.saveTags(this.noteEmail, this.tagList);
    this.tag = new Tag();
  }

  changeExistingTag() {
    let val = this.name.nativeElement.value;
    this.tagList[this.currentIndex].name = val;
    this.database.saveTags(this.noteEmail, this.tagList);
    this.currentIndex = -1;
  }

  createID() {
    let id = '';
    for (let i = 0; i < 10; i++) {
      id += Math.floor(10 * Math.random());
    }
    return id;
  }

  createNewTag() {
    this.currentIndex = -1;
    this.canCreateTag = false;
    this.name.nativeElement.value = '';
  }

  cancelSave() {
    this.currentIndex = -1;
    this.canCreateTag = true;
    this.name.nativeElement.value = '';
  }

  modifyTag(i) {
    this.currentIndex = i;
    this.canCreateTag = false;
    this.name.nativeElement.value = this.tagList[i].name;
  }

  deleteTag(i) {
    this.tagList.splice(i, 1);
    this.database.saveTags(this.noteEmail, this.tagList);
    this.cancelSave()
  }

  addNotesArrayAtTagCreation(tagId) {
    let map = this.database.getNotesInTag(this.noteEmail);
    map[tagId] = [];
    this.database.saveNotesInTag(this.noteEmail, map);
  }

  deleteTagFromEveryNote(tagIndex, tagId: number){
    let map = this.database.getNotesInTag(this.noteEmail);
    let noteArray = map[tagId];

    for(let n in noteArray){

    }
  }

}
