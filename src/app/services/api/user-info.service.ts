import { inject, Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService  {

  private _authService:AuthService = inject(AuthService);
  private supabaseClient:SupabaseClient = this._authService.client;

  constructor() { }


  

}
