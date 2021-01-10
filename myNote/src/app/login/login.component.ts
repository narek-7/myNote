import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('email') email: ElementRef<any> = null;
  @ViewChild('password') password: ElementRef<any> = null;

  form: FormGroup;
  incorrectData: boolean
  noteEmail = localStorage.getItem('Email');
  notePassword = localStorage.getItem('Password');

  constructor(
    private router: Router,
  ) {}

  ngOnInit() {
    this.incorrectData = false;
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.email,
        Validators.required
      ]),

      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }
  submit (){
    if(this.noteEmail === this.form.value.email && this.notePassword === this.form.value.password){
      this.router.navigate(['/myNote'])
    }
    else{
      this.incorrectData = true;
    }
  }
}
