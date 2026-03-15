import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-job-edit',
  imports: [ CommonModule, FormsModule],
  templateUrl: './job-edit.html',
  styleUrls: ['./job-edit.scss'],
})
export class JobEdit {
  errorMessage = '';
  submitting = false;
  jobId = '';

  form = {
    title: '',
    description: '',
    budget: 0,
    category: '',
    status: 'open' as 'open' | 'in_progress' | 'completed' | 'closed' | 'pending'
  };

  constructor(
    private readonly jobService: JobService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ){
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.jobId = id;

    this.jobService.getById(id).subscribe({
      next: (res) => {
        this.form = {
          title: res.title,
          description: res.description,
          budget: res.budget,
          category: res.category,
          status: res.status
        };
      },
      error: () => {
        this.router.navigate(['/jobs']);
      }
    });
  }

  submit() {
    if(!this.form.title.trim()){
      this.errorMessage = 'Title is required';
      return;
    }

    if(!this.form.description.trim()){
      this.errorMessage = 'Description is required';
      return;
    }

    if(this.form.budget <= 0){
      this.errorMessage = 'Budget must be greater than 0';
      return;
    }

    this.submitting = true;

    this.jobService.updateJob(
      this.jobId,
      this.form.title,
      this.form.description,
      this.form.budget,
      this.form.category,
      this.form.status,
    ).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/jobs']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update job';
        this.submitting = false;
      }
    });
  }
}
