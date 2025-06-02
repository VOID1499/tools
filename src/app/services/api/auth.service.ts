import { Injectable } from '@angular/core';
import { createClient,SupabaseClient } from "@supabase/supabase-js";
import { environment } from '../../../environments/environment';
import { BehaviorSubject,Observer,ReplaySubject,Subject,Subscription } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private supabase:ReplaySubject<SupabaseClient> = new ReplaySubject(1);
  supabase$ = this.supabase.asObservable();

  constructor() {
    this.createAnonClient();
  }

  createAnonClient(){
    const supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);
    this.supabase.next(supabase);
  }


}
