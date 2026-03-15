import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { CreateJob } from '../components/create-job/create-job';

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  program: string;
  bio?: string;
  skills?: string[];
  rating_avg: number;
  completed_jobs: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(
    private readonly http: HttpClient

  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/auth/login`, { email, password })
      .pipe(
        catchError((error) => {
          console.error('Login error:', error);  
          return throwError(() => new Error(error.error?.message || 'Login failed'));
        })
      );
  }

  register(
    name: string,
    username: string,
    email: string,
    password: string,
    bio: string,
    skills?: string[]
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.BASE_URL}/auth/register`, {
      name,
      username,
      email,
      password,
      bio,
      skills
    });
  }

  createJob(title: string, description: string, budget: number, category: string) {
    const token = localStorage.getItem('token');

    console.log("Sending Job token: ", token);
    return this.http.post<AuthResponse>(`${this.BASE_URL}/jobs`, { title, description, budget, category },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .pipe(
        catchError((error) => {
          console.error('Create job error:', error);  
          return throwError(() => new Error(error.error?.message || 'Create job failed'));
        })
      );
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.BASE_URL}/users/me`);
  }

  getJob(title: string): Observable<CreateJob> {
    const token = localStorage.getItem('token');
    console.log('title:', title);

    return this.http.get<CreateJob>(
      `${this.BASE_URL}/jobs/${title}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  getUserProfile(username: string): Observable<User> {
    const token = localStorage.getItem('token');
    console.log('Username:', username);

    return this.http.get<User>(
      `${this.BASE_URL}/users/${username}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  setUsername(username: string) {
    localStorage.setItem('username', username);
  }
   
  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  setTitle(title: string) {
    localStorage.setItem('title', title);
  }

  getTitle(): string | null {
    return localStorage.getItem('title');
  }

  getAuthHeaders(){
    return{
      Authorization: `Bearer ${localStorage.getItem('token')}`
    };
  }

  getMe(): Observable<User>{
    return this.http.get<User>(`${this.BASE_URL}/users/me`, {
      headers: new HttpHeaders(this.getAuthHeaders())});
  }

}