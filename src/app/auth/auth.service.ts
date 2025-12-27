import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  async login(email: string, password: string): Promise<void> {
    const res: any = await firstValueFrom(
      this.http.post('/login', { email, password })
    );

    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;
    this.router.navigateByUrl('/');
  }

  async register(email: string, password: string): Promise<void> {
    await firstValueFrom(
      this.http.post('/register', { email, password })
    );
    this.router.navigateByUrl('/login');
  }

  async refresh(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('no refresh token');
    }

    const res: any = await firstValueFrom(
      this.http.post('/refresh', {
        refresh_token: this.refreshToken,
      })
    );

    this.accessToken = res.access_token;
    this.refreshToken = res.refresh_token;
  }

  logout(): void {
    if (this.refreshToken) {
      this.http.post('/logout', {
        refresh_token: this.refreshToken,
      }).subscribe();
    }
    this.clear();
    this.router.navigateByUrl('/login');
  }

  clear(): void {
    this.accessToken = null;
    this.refreshToken = null;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}