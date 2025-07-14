import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private fb:FormBuilder = inject(FormBuilder);

  loginForm = this.fb.group({
    email:["",[Validators.required,Validators.email]],
    password:["",[Validators.required]]
  })


  onSubmit(){
    if(this.loginForm.valid){
      console.log("ok")
    }else{
      console.log("no valido")
    }
  }

}
