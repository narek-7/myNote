import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tag } from './../../model/tag';
import { Router } from '@angular/router';
import { DatabaseService } from './../../database.service';

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
    console.log(this.tagList);
  }

  saveTag() {
    let value = this.name.nativeElement.value;
    if (value != '' && this.currentIndex === -1) {
      this.tag.name = value;
      this.tag.createdDate = new Date();
      this.tag.id = this.tag.createdDate.toString();
      this.tagList.push(this.tag)
      this.database.saveTags(this.noteEmail, this.tagList)
      this.tag = new Tag();
      this.canCreateTag = true;
    }
    else{
      if(value != '' && this.currentIndex != -1)
      this.tagList[this.currentIndex].name === this.name.nativeElement.value;
      this.database.saveTags(this.noteEmail, this.tagList);
      this.currentIndex = -1;
      this.canCreateTag = true;
    }
    console.log(this.tagList);
  }

  cancelSave() {}

  modifyTag() {}

  deleteTag() {}
}
