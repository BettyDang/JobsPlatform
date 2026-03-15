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
  
  

      
  
        


  // private getToken(): string {
  //   return localStorage.getItem('token') || '';
  // }

  


  // private getAuthToken(): string {
  //   const token = localStorage.getItem('authToken');
  //   console.log('Auth Token from localStorage:', token);
  //   return token || '';
  // }


  // // getJob(jobId: string): Observable<Job> {
  // //   const token = localStorage.getItem('token');

  // //   return this.http.get<Job>(`${this.BASE_URL}/jobs/${jobId}`, {
  // //     headers: {
  // //       Authorization: `Bearer ${token}`
  // //     }
  // //   })
  // //   .pipe(
  // //     catchError(err => {
  // //       if(err.status === 404) {
  // //         console.warn('Job not found');
  // //       } else if (err.status === 401) {
  // //         console.warn('Unauthorized: Invalide token');
  // //       } else {
  // //         console.error('Error fetching job: ', err);
  // //       }
  // //       return throwError(() => err);
  // //     })
  // //   );
  // // }

  // // Get Job by ID
  // getJobs(): Observable<Job[]> {
  //   return this.http.get<Job[]>(`${this.BASE_URL}/jobs`, {
  //     headers: {
  //       Authorization: `Bearer ${this.getToken()}`
  //     }
  //   })
  //   .pipe(
  //     catchError(err => {
  //         console.error('Error fetching job: ', err);
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // //Get Jobs posted
  // getJob(jobId: string): Observable<Job> {
  //   if(!jobId) 
  //     return throwError(() => new Error('Invalide Job ID')
  //     );


  //   return this.http.get<Job>(`${this.BASE_URL}/jobs/${jobId}`, {
  //     headers: {
  //       Authorization: `Bearer ${this.getToken()}`
  //     }
  //   })
  //   .pipe(
  //     catchError(err => {
  //       if(err.status === 404) {
  //         console.warn('Job not found');
  //       } else if (err.status === 401) {
  //         console.warn('Unauthorized: Invalide token');
  //       } else {
  //         console.error('Error fetching job: ', err);
  //       }
  //       return throwError(() => err);
  //     })
  //   );
  // }

  // updateJob(jobId: string, data: any) {
  //   const validStatuses = ['open', 'in_progress', 'completed'];
  //   if (data.status && !validStatuses.includes(data.status)) {
  //     return throwError(() => new Error('Invalid status value'));
  //   }

  //   const fieldsToUpdate = ['title', 'description', 'budget', 'category', 'status']
  //   .filter(key => data[key as keyof Job] !== undefined);

  //   if(fieldsToUpdate.length === 0) {
  //     return throwError(() => new Error('No valid fields to update'));
      
  //   }
  //   return this.http.patch<Job>(`${this.BASE_URL}/jobs/${jobId}`, data, {
  //     headers: {
  //       Authorization: `Bearer ${this.getToken()}`
  //     }
  //   })
  //   .pipe(
  //     catchError(err => {
  //       if(err.status === 404) {
  //         console.warn('Job not found');
  //       } else if (err.status === 401) {
  //         console.warn('Unauthorized: Invalide token');
  //       } else {
  //         console.error('Error fetching job: ', err);
  //       }
  //       return throwError(() => err);
  //     })
  //   );

  // }

  // getMyJobs():Observable<Job[]> {
  //   return this.http.get<Job[]>(`${this.BASE_URL}/jobs/my-postings`, {
  //     headers: {
  //       Authorization: `Bearer ${this.getToken()}`
  //     }
  //   }) 
  //   .pipe(
  //       catchError(err => {
  //         console.error('Error fetching my jobs: ', err);
  //         return throwError(() => err);
  //       })
  //     )
  //    }


    

  // completeJob(jobId: string) {

  //   return this.http.patch(`${this.BASE_URL}/jobs/${jobId}/complete`, {}, {
  //     headers: { Authorization: `Bearer ${this.getToken()}`}
  //   })
  //   .pipe(
  //     catchError(err => {
  //       console.error('Complete job error', err);
  //       return throwError(() => err);
  //     })
  //   );
  // };

  

function jwt_decode(token: string): any {
  throw new Error('Function not implemented.');
}



