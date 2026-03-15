import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Job, JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Proposal, ProposalService } from '../../services/proposal.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-job-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './job-details.html',
  styleUrls: ['./job-details.scss'],
})
export class JobDetails {
  job?: Job;
  errorMessage = '';
  loading = true;

  price: number = 0;
  coverLetter: string = '';
  message: string = '';

  proposals: Proposal[] = [];

  currentUserId = '';
  isOwner = false;
  freelancer = false;

  rating = 0;
  reviewComment = '';
  reviewSubmitted = false;


  constructor(
    private readonly route: ActivatedRoute,
    private readonly jobService: JobService,
    private readonly  proposalService: ProposalService,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly reviewService: ReviewService
  ) {
    // check if user session is valid
    this.authService.getMe().subscribe({
      next:(user)=>{
        this.currentUserId = user.id;
        this.loadJob();
      },
      error: ()=>{
        this.authService.clearToken();
        this.router.navigate(['/login']);
      }
    });
  }

  // load job
  loadJob(){
    const jobId = this.route.snapshot.paramMap.get('id');
    //console.log("Job ID: ", jobId);

    if (!jobId) {
      this.errorMessage = "Invalid Job ID";
      this.loading = false;
      return;
    }

    this.jobService.getById(jobId).subscribe({
      next: (res) => {
        this.job = res;
        this.loading = false;

        this.isOwner = this.job.owner?.id === this.currentUserId;
        this.freelancer = this.job.freelancer?.id === this.currentUserId;

        this.loadProposal();
      },
      error: (err) => {
        console.log(err);
        this.errorMessage = "Failed to load job";
        this.loading = false;
      }
    });
  }

  // Load Proposal
  loadProposal() {
    if(!this.job?.id) 
      return;
    //console.log("This Job: ", this.job);

    this.proposalService.getJobProposals(this.job.id).subscribe({
      next: (res) => {
        //console.log("Poposal Get: ", res);

        const proposalsWithId = res.map( p => ({
          ...p,
          id: p.id || ( p as any)._id
        }));

        if(this.isOwner) {
          this.proposals = proposalsWithId;
        } else {
          this.proposals = proposalsWithId.filter( p => p.freelancer_id === this.currentUserId);
        }
        
        },
        error: (err) => {
          console.log('Failed to load proposals', err)
        }
          
      });
    }

    // submit proposal
    submitProposal() {
      if (!this.job) {
        console.error('Job not loaded yet');
        return;
      }

      if (!this.price) {
        console.error('Price is required');
        return;
      }

      if (!this.coverLetter && !this.message) {
        console.error('Cover letter or message is required');
        return;
      }

      this.proposalService.submitProposal(this.job.id, this.price, this.coverLetter , this.message ).subscribe({
        next: () => {
          alert("Proposal submitted successfully");

            this.price = 0;
            this.coverLetter = '';
            this.message = '';
        },
        error: (err) => {
          alert("Failed to submit proposal");
          console.log(err);
        }
      });
    }

    // accept proposal
    acceptProposal(proposalId: string) {

      if(!confirm("Accept this proposal?")){
        return;
      }
      this.proposalService.acceptProposal(proposalId).subscribe({
        next: () => {
          alert('Proposal accepted');
          this.loadProposal();
          this.loadJob();
        },
        error: (err) => {
          alert('Failed to accept proposal');
          console.log("Accept proposal failed ", err);
        }
      });
    }

    // withdraw
    // withdrawProposal(id: string) {

    //   if(!confirm("Do you want to withdraw this proposal")){
    //     return;
    //   }

    //   this.proposalService.withdrawProposal(id).subscribe({
    //     next: () => {
    //       alert('Proposal withdrawn');
    //       this.loadProposal();
    //     },
    //     error: (err) => {
    //       alert('Failed to withdraw proposal');
    //       console.log(err);
    //     }
    //   });
    // }

    submitReview() {

      console.log("JOB ID:", this.job?.id);
      console.log("JOB STATUS:", this.job?.status);
      
      console.log("Token:", this.authService.getToken());
      if(!this.job?.id || !this.job.freelancer?.id)
        return;

      if(!this.rating){
        alert("Rating is Required");
        return;
      }

      let targetId: string;

      if(this.isOwner){
        targetId = this.job.freelancer!.id;
      } else {
        targetId = this.job.owner!.id;
      }


      this.reviewService.submitReview(
        this.job.id,
        targetId,
        this.rating,
        this.reviewComment
      ).subscribe ({
        next: () => {
          alert("Review submitted");
          this.reviewSubmitted = true;

          // reload freelancer profile 
          this.authService.getUserProfile(this.job?.freelancer?.username!).subscribe({
            next: (user) => {
              console.log("Updated freelancer rating: ", user.rating_avg);

              this.loadJob();
            }
          })
        },
        error: (err) => {
          console.log(err);
          alert("Failed to submit review")
        }
      })
        
    }
}
