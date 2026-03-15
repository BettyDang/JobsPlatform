import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export interface Proposal {
  id?: string;
  job_id: string;
  price: number;
  cover_letter?: string;
  freelancer_id: string;
  freelancer?:{
    id: string;
    name: string;
    username?: string;
  };
  message?: string;
  status?: string;
}

@Injectable({
  providedIn: 'root',
})

export class ProposalService {

  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(
    private http: HttpClient,
    private  readonly authService: AuthService, 
  ) {}

  submitProposal(jobId: string, price: number, cover_letter?: string, message?: string) {

    const body: any = {
      price: price
    };

    if(cover_letter) {
      body.cover_letter = cover_letter;
    }

    if(message) {
      body.message = message;
    }

    return this.http.post(
      `${this.BASE_URL}/jobs/${jobId}/proposals`,
      body,
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    )
    .pipe (
      catchError(err => {

        if (err.status === 403) {
          console.warn('You cannot submit a proposal to your own job');
        }
        else if (err.status === 404) {
          console.warn('Job not found');
        }
        else if (err.status === 409) {
          console.warn('You already have a pending proposal for this job');
        }
        else if (err.status === 400) {
          console.warn('Price, cover letter, message are required or job is not open');
        }
        else {
          console.error('Proposal submission failed', err);
        }
        return throwError(() => err);
      })
    );
  }

  getJobProposals(jobId: string): Observable<Proposal[]>{

    return this.http.get<Proposal[]>(
      `${this.BASE_URL}/jobs/${jobId}/proposals`,
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    )
    .pipe (
      catchError(err => {

        if (err.status === 403) {
          console.warn('You are not the job owner');
        }
        else if (err.status === 404) {
          console.warn('Job not found');
        }
        else {
          console.error('Error fetching proposals', err);
        }
        return throwError(() => err);
      })
    );

  }

  acceptProposal(proposalId: string){
    return this.http.patch(
      `${this.BASE_URL}/proposals/${proposalId}/accept`,
      {},
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    );

  }

  withdrawProposal(proposalId: string) {

    return this.http.delete(
      `${this.BASE_URL}/proposals/${proposalId}`,
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      })
      .pipe (
        catchError(err => {
  
          if (err.status === 403) {
            console.warn('Forbidden');
          }
          else if (err.status === 404) {
            console.warn('Proposal not found');
          }
          else if (err.status === 400) {
            console.warn('Only pending proposals can be delted');
          }
          return throwError(() => err);
        })
      );
  }

  getMyBids(): Observable<Proposal[]> {
    return this.http.get<Proposal[]> (
      `${this.BASE_URL}/proposals/my-bids`,
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    );
  }
  
}
