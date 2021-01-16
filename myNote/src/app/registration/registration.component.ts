import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from './../database.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  @ViewChild('email') email: ElementRef<any> = null;
  @ViewChild('password') password: ElementRef<any> = null;
  incorrectData: boolean = false;
  errorMassage: string = '';

  form: FormGroup;
  constructor(
    private router: Router,
    private database: DatabaseService,
  ){}

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
    let email = this.form.value.email;
    let password = this.form.value.password;
    try {
      this.database.register(email, password);
      this.router.navigate(['myNote']);
    }
    catch(e) {
      this.incorrectData = true;
      this.errorMassage = e.message;
      setTimeout(() => {
        this.incorrectData = false;
      }, 5000);
    }
  }
}
