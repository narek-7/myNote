import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('email') email: ElementRef<any> = null;
  @ViewChild('password') password: ElementRef<any> = null;

  form: FormGroup;
  constructor(
    private router: Router
  ){}

  ngOnInit() {
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

    this.router.navigate(['myNote']);
    let email = this.form.value.email;
    let password = this.form.value.password;
    localStorage.setItem('Email', email);
    localStorage.setItem('Password', password);
    //this.noteEmail = localStorage.getItem('Email');
    //this.notePassword = Number(localStorage.getItem('Password'));
    //Email = this.highScore.toString();
  }
}
