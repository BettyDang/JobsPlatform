import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Job, JobService } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { PlatformStatsComponent } from '../platform-stats/platform-stats';

@Component({
  selector: 'app-job-list',
  imports: [ CommonModule, RouterModule, FormsModule, PlatformStatsComponent],
  templateUrl: './job-list.html',
  styleUrls: ['./job-list.scss'],
})
export class JobList {
  jobs: Job[] = [];
  keyword = '';
  category = '';
  minBudget = 0;
  errorMessage = '';
  searchPerformed = false;

  constructor(
    private readonly jobService: JobService,
    private readonly authService: AuthService,
    private readonly router: Router
  ){}

  ngOnInit(){
    this.authService.getMe().subscribe({
      next: () => {
      },
      error: () => {
        this.authService.clearToken();
        this.router.navigate(['/login']);
      }
  });

    this.loadJobs();
  }

  loadJobs(){
    this.jobService.listAll().subscribe({
      next: (res) => {
        //console.log("Job List: ", res);
        this.jobs = res;
      },
      error: (err) => {
        console.log('Failed to load jobs', err);
      }
    });
  }

  deleteJob(jobId: string){
    if(!confirm('Are you sure you want to delete this job?')) {
      return;

    }

    this.jobService.deleteJob(jobId).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(job => job.id !== jobId);
        console.log(`Job ${jobId} deleted successfully`);
      },
      error: (err) => {
        console.error('Failed to delete job', err);
      }
    })
  }

  searchJobs() {
    this.jobService.searchJobs({
      keyword: this.keyword,
      category: this.category,
      min_budget: this.minBudget,
    }).subscribe({
      next: (res) => {
        this.jobs = res;  
        this.searchPerformed = true;
      },
      error: (err: any) => {
        console.error('Error:', err); 
        this.errorMessage = err?.error?.message || 'Search failed';  
        this.searchPerformed = true;
      },
    });
  }

  resetSearch(){
    this.keyword = '';
    this.category = '';
    this.minBudget = 0;

    this.loadJobs();
  }



}
