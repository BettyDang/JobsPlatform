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
        this.router.navigate(['/jobs']);
      },
      error: (err: any) => {
        console.error('Create job error:', err);
        this.errorMessage = err?.error?.error || 'Create job failed';
      }
    });
    
  }

}
