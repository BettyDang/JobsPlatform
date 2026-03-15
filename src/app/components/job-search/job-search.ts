import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job, JobService } from '../../services/job.service'; 
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-job-search',
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './job-search.html',
  styleUrls: ['./job-search.scss'],
})
export class JobSearch {
  keyword = '';
  category = '';
  minBudget = 0;
  jobs: Job[] = [];
  errorMessage = '';
  searchPerformed = false;

  constructor(private jobService: JobService) {}

  searchJobs() {
    this.jobService.searchJobs({
      keyword: this.keyword,
      category: this.category,
      min_budget: this.minBudget,
    }).subscribe({
      next: (jobs: Job[]) => {
        this.jobs = jobs;  
        this.searchPerformed = true;
      },
      error: (err: any) => {
        console.error('Error:', err); 
        this.errorMessage = err?.error?.message || 'Search failed';  
        this.searchPerformed = true;
      },
    });
  }
}