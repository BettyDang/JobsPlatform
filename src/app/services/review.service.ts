import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';


export interface Review {
  target_id: string;
  rating: number;
  comment: string;
}

@Injectable({
  providedIn: 'root',
})

export class ReviewService {

  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  constructor(
    private http: HttpClient,
    private  readonly authService: AuthService, 
  ) {}

  submitReview(jobId: string, freelancerId: string, rating: number, comment: string): Observable<any>{

    return this.http.post(
      `${this.BASE_URL}/jobs/${jobId}/reviews`,
      { 
        target_id: freelancerId,
        rating: rating,
        comment: comment
      },
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    );
  }

  getUserReviews(userId: string): Observable<Review[]>{
    return this.http.get<Review[]>(
      `${this.BASE_URL}/reviews/user/${userId}`,
      {
        headers: new HttpHeaders(this.authService.getAuthHeaders())
      }
    );
  }
  
}
