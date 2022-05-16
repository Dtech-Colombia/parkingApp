import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm : FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required,  Validators.minLength(8)]],
    })
  }
  get errorControl() {
    return this.loginForm.controls;
  }

  doLogin(){
    this.isSubmitted = true;
    console.log(this.loginForm.value)
    /*this.service.doPost({action : '/main/attemptLogin',postData : values})
    .then((responseBody : any) => {
      this.loginForm.reset()
      this.parameters.saveLogin(JSON.stringify(responseBody));
      this.router.navigate(['home']);
    }).catch(err =>{});*/
  }

}
