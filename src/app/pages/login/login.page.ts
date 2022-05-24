import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router';
import { ApiService } from '../../service/api/api.service'
import { ParameterService } from '../../service/parameters/parameter.service'

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
    private api: ApiService,
    private parameters: ParameterService,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required,  Validators.minLength(8)]],
    })
  }

  ionViewDidEnter (){
    this.isSubmitted = false;
  }
  get errorControl() {
    return this.loginForm.controls;
  }

  doLogin(){
    this.isSubmitted = true;
    console.log(this.loginForm.value)
    this.api.doPost({action : '/main/login',postData : this.loginForm.value})
    .then((user : any) => {
      this.loginForm.reset()
      this.parameters.saveParameters('token:',user.token)
      this.parameters.saveLogin(JSON.stringify(user));
      this.router.navigate(['reserve']);
    }).catch(err =>{});

  }

}
