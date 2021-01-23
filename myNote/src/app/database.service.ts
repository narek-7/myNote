import { Injectable } from '@angular/core';
import { User } from './model/user';
import { Note } from './model/note';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  user: User;
  notes: Array<Note>;

constructor() { }

register(email: string, password: string) {
  let users = this.getAllItems("users");
  if(users[email]) {
    throw new Error('User already exists');
  }
  let user = {email, password};
  users[email] = user;
  this.saveAllItems("users", users);
  window.localStorage.setItem("Email", email)
}

login(email: string, password: string) {
  let users = this.getAllItems("users");
  let user = users[email];
  if(!user) {
    throw new Error('Wrong email');
  }
  if(user.password !== password) {
    throw new Error('Wrong password');
  }
  this.user = user;
  this.notes = this.getNotes(email);
  window.localStorage.setItem("Email", email)
}

getNotes(email: string) {
  let allNotes = this.getAllItems("notes");
  let userNotes = allNotes[email];
  return userNotes ? userNotes : [];
}

getAllItems(key): Map<string, User> {
  let usersStr = window.localStorage.getItem(key);
    if(usersStr) {
      return JSON.parse(usersStr);
    }
  return new Map<string, User>();
}

saveNotes(email: string, notes: Array<Note>) {
  let allNotes = this.getAllItems("notes");
  allNotes[email] = notes;
  this.saveAllItems("notes", allNotes);
}

saveAllItems(key: string, items: Map<string, User>) {
  window.localStorage.setItem(key, JSON.stringify(items));
}

}
