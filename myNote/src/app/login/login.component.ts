import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatabaseService } from './../database.service';
import { User } from './../model/user';
import { AuthService } from './../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('email') email: ElementRef<any> = null;
  @ViewChild('password') password: ElementRef<any> = null;

  form: FormGroup;
  incorrectData: boolean;
  errorMassage: string = '';

  constructor(
    private router: Router,
    private database: DatabaseService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    console.log(localStorage.getItem('users'));

    this.incorrectData = false;
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email, Validators.required]),

      password: new FormControl(null, [
        Validators.minLength(6),
        Validators.maxLength(10),
        Validators.required,
        Validators.pattern('^[0-9]*$'),
      ]),
    });
  }
  async submit() {
    try {
      await this.database.login(this.form.value.email, this.form.value.password);
      this.auth.login();
      this.router.navigate(['myNote', 'notes']);
    } catch (e) {
      this.incorrectData = true;
      this.errorMassage = 'email or password is incorrect';
      setTimeout(() => {
        this.incorrectData = false;
      }, 10000);
    }
  }
}
