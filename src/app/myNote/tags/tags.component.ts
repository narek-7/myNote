import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Tag } from './../../model/tag';
import { ActivatedRoute, Router } from '@angular/router';
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
  t: number = 0;

  @ViewChild('name') name: ElementRef<any> = null;

  constructor(
    private router: Router,
    private database: DatabaseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.noteEmail = window.localStorage.getItem('Email');
    this.tagList = this.database.getTags(this.noteEmail);
    // console.log('TagList', this.tagList);
    this.route.queryParams.subscribe((params: any) => {
      this.canCreateTag = false;
      this.showTags(params.idTag);
    });
  }

  async showTags(id) {
    if (!id) {
      this.canCreateTag = true;
      return;
    }
    let idx = await this.tagList.findIndex((value) => {
      return value.id === id;
    });
    this.currentIndex = idx;
    this.completeData(idx);
  }

  completeData(idx) {
    this.name.nativeElement.value = this.tagList[idx].name;
  }

  changeExistingTag() {
    let val = this.name.nativeElement.value;
    this.tagList[this.currentIndex].name = val;
    this.database.saveTags(this.noteEmail, this.tagList);
    this.updateTag();
    this.changeTagsInEveryNote(this.currentIndex);
    this.currentIndex = -1;
  }

  updateTag() {
    let tShortcut = this.database.getTagShortcut(this.noteEmail);
    this.tagList.forEach((t) => {
      if (tShortcut[t.id]) {
        tShortcut[t.id] = t.name;
      }
    });
    this.database.saveTagShortcut(this.noteEmail, tShortcut);
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
    this.router.navigate(['/myNote', 'tags']);
  }

  addQuerryParam(item) {
    this.router.navigate(['/myNote', 'tags'], {
      queryParams: { idTag: item.id },
    });
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

  changeTagsInEveryNote(idx) {
    let tagName = this.tagList[idx].name;
    let tagId = this.tagList[idx].id;
    let nArr = this.database
      .getNotesInTag(this.noteEmail)
      [tagId].map((n: Note) => {
        return n.id;
      });
    if (nArr) {
      let Map = this.database.getTagsInNote(this.noteEmail);
      for (let i in nArr) {
        Map[nArr[i]].map((t: Tag) => {
          if (t.id === tagId) {
            t.name = tagName;
          }
          return t;
        });
      }
      this.database.saveTagsInNote(this.noteEmail, Map);
    }
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
    this.name.nativeElement.value = '';
    this.canCreateTag = true;
    this.router.navigate(['/myNote', 'tags']);
  }

  modifyTag(i) {
    this.currentIndex = i;
    this.canCreateTag = false;
    this.name.nativeElement.value = this.tagList[i].name;
  }

  modifyTitleName(title: string) {
    if (title.length > 11) {
      return title.slice(0, 11) + '...';
    }
    return title;
  }

  addNotesArrayAtTagCreation(tagId) {
    let map = this.database.getNotesInTag(this.noteEmail);
    map[tagId] = [];
    this.database.saveNotesInTag(this.noteEmail, map);
  }

  deleteTag(i) {
    let delTagId = this.tagList[i].id;
    this.tagList.splice(i, 1);
    this.deleteTagShorcut(delTagId);
    this.database.saveTags(this.noteEmail, this.tagList);
    this.deleteAllConnectionsTagAndNote(delTagId);
    this.cancelSave();
  }

  deleteTagShorcut(id) {
    let map = this.database.getTagShortcut(this.noteEmail);
    if (map[id]) {
      delete map[id];
      this.database.saveTagShortcut(this.noteEmail, map);
    }
    return;
  }

  deleteAllConnectionsTagAndNote(deletedTagId) {
    this.deleteTagFromEveryNote(deletedTagId);
    this.deleteNotesInTag(deletedTagId);
  }

  deleteNotesInTag(tId) {
    let map = this.database.getNotesInTag(this.noteEmail);
    delete map[tId];
    this.database.saveNotesInTag(this.noteEmail, map);
  }

  deleteTagFromEveryNote(tId) {
    let noteIdArr = this.database
      .getNotesInTag(this.noteEmail)
      [tId].map((n: Note) => {
        return n.id;
      });
    if (noteIdArr) {
      let Map = this.database.getTagsInNote(this.noteEmail);
      for (let i in noteIdArr) {
        Map[noteIdArr[i]] = Map[noteIdArr[i]].filter((t: Tag) => {
          if (t.id != tId) {
            return t;
          }
        });
      }
      this.database.saveTagsInNote(this.noteEmail, Map);
    }
  }

  quantityOfNotes(id) {
    let q = this.database.getNotesInTag(this.noteEmail)[id].length;
    if (q) return q;
    return 0;
  }

  addCancelShortcut(id, idx) {
    let map = this.database.getTagShortcut(this.noteEmail);
    if (!map[id]) {
      map[id] = this.tagList[idx].name;
    } else {
      delete map[id];
    }
    this.database.saveTagShortcut(this.noteEmail, map);
    // console.log(map);
  }

  shortcut(id) {
    let map = this.database.getTagShortcut(this.noteEmail);
    if (map[id]) {
      return 'https://raw.githubusercontent.com/narek-7/myNote/master/myNote/src/assets/images/star1.png';
    }
    return 'https://raw.githubusercontent.com/narek-7/myNote/master/myNote/src/assets/images/star4.png';
  }
}
