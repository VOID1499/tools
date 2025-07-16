import { Component, inject } from '@angular/core';
import { UserInfoService } from '../../services/api/user-info.service';
import { UserInfo } from '../../interfaces/userInfo.interface';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [JsonPipe],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {

  private userInfoService:UserInfoService = inject(UserInfoService);
  public userInfo:Partial<UserInfo> = {
    id:"qdf324ca34",
    nombre:"pepe",
    departamento:"b55",
  }

  constructor(){

  }

  ngOnInit():void{
   
  }

}
