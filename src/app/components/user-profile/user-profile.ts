import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService, User } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile {
  user?: User;
  errorMessage = '';
  loading = true;

  reviews: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const username = this.authService.getUsername();

    if (username) {
      this.authService.getUserProfile(username).subscribe({
        next: (user) => {
          console.log("User Profile", user);
          this.user = user;
          this.loading = false;


          // Review for Freelancer
          this.reviewService.getUserReviews(user.id).subscribe({
            next: (reviews) => {
              
              this.reviews = reviews;
              console.log("User Reviews", reviews);
        },
            error: (err) => {
              console.error("Failed to load reviews", err);
            },
          });
        },
        error: (err) => {
          this.errorMessage = this.getErrorMessage(err);
          this.loading = false;
        }
      });
    }
    
  }

  private getErrorMessage(err: any): string {
    if (err?.status === 404) {
      return 'User not found';
    } else if (err?.status === 401) {
      return 'Invalid or expired token. Please log in again';
    }
    return 'An unexpected error occurred. Please try again later.';
  }

}
