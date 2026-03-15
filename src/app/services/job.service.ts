import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { AuthResponse, AuthService } from './auth.service';
import { JobDetails } from '../components/job-details/job-details';


export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  owner?: {id: string; name: string; username: string};
  freelancer?: {id: string; name: string; username?: string};
  status: 'open' | 'in_progress' | 'completed' | 'closed';
}

@Injectable({
  providedIn: 'root',
})
export class JobService {

  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {}

  listAll(): Observable<Job[]>{
    //console.log('Headers:', this.authService.getAuthHeaders());
    return this.http.post<Job[]>(`${this.BASE_URL}/jobs/search`, {},
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    ).pipe(
      map(jobs => jobs.map(j => ({
        ...j,
        id: j.id || (j as any)._id
      })))
    );
  }

  // create Job
  createJob(title: string, description: string, budget: number, category: string): Observable<Job>{ 
  // console.log("Sending Job token: ", this.getToken());
  return this.http.post<Job>(`${this.BASE_URL}/jobs`, { title, description, budget, category },
    {
      headers: 
        new HttpHeaders(this.authService.getAuthHeaders()) }
      );
    }

  // Delete job
  deleteJob(id: string): Observable<any>{
    return this.http.delete<any>(
      `${this.BASE_URL}/jobs/${id}`,
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  // Get job by ID
  getById(id: string): Observable<Job>{
    return this.http.get<Job>(
      `${this.BASE_URL}/jobs/${id}`,
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  // Update job
  updateJob(
    id: string,
    title: string,
    description: string,
    budget: number,
    category: string,
    status: string,
  ): Observable<any>{
    return this.http.patch<any>(
      `${this.BASE_URL}/jobs/${id}`,
      { title, description, budget, category, status },
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  // Get jobs posted by current user
  getMyJobs(): Observable<Job[]>{
    return this.http.get<Job[]>(
      `${this.BASE_URL}/jobs/my-postings`,
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  // Complete job
  completeJob(id: string): Observable<any>{
    return this.http.patch<any>(
      `${this.BASE_URL}/jobs/${id}/complete`,
      {},
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  // search job
  searchJobs({ keyword, category, min_budget }: { keyword: string; category?: string; min_budget: number }) {

    const body: any = {};
    if (keyword?.trim()) {
      body.keyword = keyword;
    }

    if (category?.trim()) {
      body.category = category;
    }

    if (min_budget && min_budget > 0) {
      body.min_budget = min_budget;
    }

    return this.http.post<Job[]>(`${this.BASE_URL}/jobs/search`, body, {
      headers: new HttpHeaders(this.authService.getAuthHeaders()) 
    })
      .pipe(
        catchError(err => {
          if (err.status === 404) {
            console.warn('No jobs found for this job search');
            return ([]);
          }
          console.error('Error searching jobs:', err);  
          return throwError(err);
        })
      );
  }

}


function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}



