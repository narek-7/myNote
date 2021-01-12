import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from './../database.service';

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

  constructor(
    private router: Router,
    private database: DatabaseService,
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
    try {
      this.database.login(this.form.value.email, this.form.value.password);
      this.router.navigate(['myNote']);
    }
    catch(e) {
      console.log(e.message);
    }
  }
}
