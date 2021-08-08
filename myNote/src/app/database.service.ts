import { EventEmitter, Injectable } from '@angular/core';
import { User } from './model/user';
import { Note } from './model/note';
import { Tag } from './model/tag';
import { HttpClient } from '@angular/common/http';

const HOST = 'http://localhost:5000';
const REGISTER = HOST + '/api/register';
const LOGIN = HOST + '/api/login';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  user: User;
  notes: Array<Note>;

  // restoredNote = new EventEmitter();

  constructor(private http: HttpClient) {}

  getNotes(email: string) {
    let allNotes = this.getAllItems('notes');
    let userNotes = allNotes[email];
    return userNotes ? userNotes : [];
  }

  saveNotes(email: string, notes: Array<Note>) {
    let allNotes = this.getAllItems('notes');
    allNotes[email] = notes;
    this.saveAllItems('notes', allNotes);
  }

  getTags(email: string) {
    let allTags = this.getAllItems('tags');
    return allTags[email] ? allTags[email] : [];
  }

  saveTags(email: string, tags: Array<Tag>) {
    let allTags = this.getAllItems('tags');
    allTags[email] = tags;
    this.saveAllItems('tags', allTags);
  }

  getNotesInTag(email: string) {
    //: Array<Note> էսի սխալ է տալիս, ինչու՞
    let allNotesInTag = this.getAllItems('NotesInTag');
    return allNotesInTag[email] ? allNotesInTag[email] : new Map<string, any>();
  }

  saveNotesInTag(email: string, map: Map<string, Array<Note>>) {
    let allNotesInTag = this.getAllItems('NotesInTag');
    allNotesInTag[email] = map;
    this.saveAllItems('NotesInTag', allNotesInTag);
  }

  getTagsInNote(email: string) {
    let allTagsInNote = this.getAllItems('TagsInNote');
    return allTagsInNote[email] ? allTagsInNote[email] : new Map<string, any>();
  }

  saveTagsInNote(email: string, map: Map<string, Array<Tag>>) {
    let allTagsInNote = this.getAllItems('TagsInNote');
    allTagsInNote[email] = map;
    this.saveAllItems('TagsInNote', allTagsInNote);
  }

  saveNoteInTrash(email: string, map: Map<string, Map<string, any>>) {
    let allTrashList = this.getAllItems('Trash');
    allTrashList[email] = map;
    this.saveAllItems('Trash', allTrashList);
  }

  getNoteFromTrash(email: string) {
    let allTrashList = this.getAllItems('Trash');
    return allTrashList[email] ? allTrashList[email] : new Map<string, any>();
  }

  getRestoredNotes(email: string) {
    let allRestNote = this.getAllItems('restoredNotes');
    return allRestNote[email] ? allRestNote[email] : [];
  }

  saveRestoredNotes(email, arr) {
    let allRestoredNotes = this.getAllItems('restoredNotes');
    allRestoredNotes[email] = arr;
    this.saveAllItems('restoredNotes', allRestoredNotes);
  }

  saveNoteStyle(email: string, map: Map<string, Map<string, any>>) {
    let allNoteStyles = this.getAllItems('NoteStyle');
    allNoteStyles[email] = map;
    this.saveAllItems('NoteStyle', allNoteStyles);
  }

  getNoteStyle(email: string): Map<string, Map<string, any>> {
    let allNoteStyles = this.getAllItems('NoteStyle');
    return allNoteStyles[email] ? allNoteStyles[email] : new Map();
  }

  saveNoteShortcut(email: string, map: Map<string, any>) {
    let allShortcutNotes = this.getAllItems('shortcutNote');
    allShortcutNotes[email] = map;
    this.saveAllItems('shortcutNote', allShortcutNotes);
  }

  getNoteShortcut(email: string) {
    let allShortcutNotes = this.getAllItems('shortcutNote');
    return allShortcutNotes[email] ? allShortcutNotes[email] : new Map();
  }

  saveTagShortcut(email: string, map: Map<string, any>) {
    let allShortcutTags = this.getAllItems('shortcutTag');
    allShortcutTags[email] = map;
    this.saveAllItems('shortcutTag', allShortcutTags);
  }

  async register(email: string, password: string) {
    const user: User = { email: email, password: password };
    try {
      let result = await this.http.post(REGISTER, user).toPromise();
      console.log('everything ok');
    } catch (e) {
      console.log(e);
      if (e.status == '501') {
        throw new Error(e.error);
      } else {
        throw new Error('Server is not responding!');
      }
    }
  }

  async login(email: string, password: string) {
    const user: User = { email: email, password: password };
    let result = await this.http.post(LOGIN, user).toPromise();
    if (!result[0].email) {
      throw new Error('wrong email or password');
    }
    this.user = user;
    this.notes = this.getNotes(email);
  }

  getTagShortcut(email: string) {
    let allShortcutTags = this.getAllItems('shortcutTag');
    return allShortcutTags[email] ? allShortcutTags[email] : new Map();
  }

  /* register(email: string, password: string) {
    let users = this.getAllItems('users');
    if (users[email]) {
      throw new Error('User already exists');
    }
    let user = { email, password };
    users[email] = user;
    this.saveAllItems('users', users);
    window.localStorage.setItem('Email', email);
  } */

  /* login(email: string, password: string) {
    let users = this.getAllItems('users');
    let user = users[email];
    if (!user) {
      throw new Error('Wrong email');
    }
    if (user.password !== password) {
      throw new Error('Wrong password');
    }
    this.user = user;
    this.notes = this.getNotes(email);
    window.localStorage.setItem('Email', email);
  } */

  getAllItems(key): Map<string, any> {
    let usersStr = window.localStorage.getItem(key);
    if (usersStr) {
      return JSON.parse(usersStr);
    }
    return new Map<string, any>();
  }

  saveAllItems(key: string, items: Map<string, any>) {
    window.localStorage.setItem(key, JSON.stringify(items));
  }
}
