import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private supabase: SupabaseClient;
  private sessionSubject = new BehaviorSubject<Session | null>(null);
  session$ = this.sessionSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    // Cargar sesión guardada (si existe)
    this.loadSession();

    // Escuchar cambios de sesión en tiempo real
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this.sessionSubject.next(session);
    });
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  private async loadSession() {
    const { data } = await this.supabase.auth.getSession();
    this.sessionSubject.next(data.session);
  }

  // Login con Google
  signInWithGoogle(redirectTo?: string) {
    return this.supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo ?? window.location.origin + '/auth/callback'
      }
    });
  }

  // Logout
  async signOut() {
    await this.supabase.auth.signOut();
    //this.sessionSubject.next(null); // opcional, Supabase también lo hace por onAuthStateChange
  }
  
}
