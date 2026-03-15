import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';


@Component({
  selector: 'app-create-job',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-job.html',
  styleUrl: './create-job.scss',
})
export class CreateJob {
  title = '';
  description = '';
  budget = 0;
  category = '';
  errorMessage = '';

  constructor(
    private jobService: JobService,
    private router: Router
  ) {}

  submit(): void {

    if (!this.title || !this.description || !this.budget || !this.category) {
      this.errorMessage = 'All fields are required';
      return;
    }
    
    this.jobService.createJob(this.title, this.description, this.budget, this.category).subscribe({
      next: (res: any) => {
        console.log('Create job success:', res);
        // this.authService.setToken(res.access_token);
        //this.authService.setTitle(res.title);
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        console.error('Create job error:', err);
        this.errorMessage = err?.error?.error || 'Create job failed';
      }
    });
    
    // console.log("Job Service: ", this.jobService)
    // this.jobService.createJob(this.title, this.description, this.budget, this.category)
    //   .subscribe({
    //     next: () => {
    //       this.router.navigate(['/jobs/details']); 
    //     },
    //     error: (err: any) => {
    //       // Log the full error object to inspect the response
    //       console.error('Job creation error:', err);
        
    //       // Log specific properties of the error to see more details
    //       if (err?.status) {
    //         console.error('HTTP Status:', err.status); // Log HTTP status code (e.g., 400, 404, 500)
    //       }
        
    //       if (err?.error) {
    //         console.error('Error Response Body:', err.error); // Log the error message returned by the server
    //       }
        
    //       if (err?.message) {
    //         console.error('Error Message:', err.message); // Log the general error message (if available)
    //       }
        
    //       // Enhanced error handling based on the error properties
    //       if (err?.status === 0) {
    //         this.errorMessage = 'Network error. Please check your connection or try again later.';
    //       } else if (err?.error?.message) {
    //         this.errorMessage = err.error.message;  // Display specific error message from the API
    //       } else {
    //         this.errorMessage = 'An unknown error occurred. Please try again later.';
    //       }
    //     }
    //   });
  }

}
