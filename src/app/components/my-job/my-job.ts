import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Job, JobService } from '../../services/job.service';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, reduce } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CssSelector } from '@angular/compiler';
import { Proposal, ProposalService } from '../../services/proposal.service';

@Component({
  selector: 'app-my-job',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './my-job.html',
  styleUrl: './my-job.scss',
})
export class MyJob {

  private readonly BASE_URL = 'https://stingray-app-wxhhn.ondigitalocean.app';

  jobs: Job[] = [];
  errorMessage = '';
  myProposals: Proposal[] =[];

  constructor(
    private readonly http: HttpClient,
    private jobService: JobService,
    private readonly authService: AuthService,
    private readonly proposalService: ProposalService,

  ) {}

  ngOnInit() {
    this.jobService.getMyJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error;
      }
    });

    this.proposalService.getMyBids().subscribe({
      next: (res) => {
        this.myProposals = res;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error;
      }
    });
  }


  updateJob(id: string, updates: Partial<Job>): Observable<Job> {
    return this.http.patch<Job>(
      `${this.BASE_URL}/jobs/${id}`,
      updates,
      { headers: new HttpHeaders(this.authService.getAuthHeaders()) }
    );
  }

  completeJob(job: Job) {
    this.jobService.completeJob(job.id).subscribe( {
      next: () => {
        // Update job
        job.status = 'completed';
        console.log(`Job ${job.id} marked as completed`);

        // reload - update completed job
        this.authService.getMe().subscribe({
          next: (user) =>{
            console.log("Updates profile: ", user);
          }
        })
      },
      error: (err) => {
         if (err.status === 403) {
          alert('Only the owner or assigned freelance can complete this job');
         } else if (err.status === 400) {
          alert('Only in-progress jobs can be completed');
         } else if (err.status === 404) {
          alert('Job not found');
         } else {
          alert('Failed to complete job');
         }
      }
    });
  }

  loadMyProposals() {
    this.proposalService.getMyBids().subscribe({
      next: (res) => {
        this.myProposals = res;
      },
      error: (err) => {
        this.errorMessage = err?.error?.error;
      }
    });
  }

  withdrawProposal(id: string) {
    if(!confirm("Do you want to withdraw this proposal")){
      return;
    }

    this.proposalService.withdrawProposal(id).subscribe({
      next: () => {
        alert('Proposal withdrawn');
        this.loadMyProposals();
      },
      error: (err) => {
        alert('Failed to withdraw proposal');
        console.log(err);
      }
    });
  }


}
