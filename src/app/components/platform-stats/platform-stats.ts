import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PlatformService, PlatformStats } from '../../services/platform.service';

@Component({
  selector: 'app-platform-stats',
  imports: [ CommonModule ],
  templateUrl: './platform-stats.html',
  styleUrls: ['./platform-stats.scss'],
})
export class PlatformStatsComponent implements OnInit{

  stats?: PlatformStats;
  loading = true;
  errorMessage = '';

  constructor(
    private readonly platformService: PlatformService
  ){}

  ngOnInit(): void {
    this.platformService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load platform stats';
        this.loading = false;
      }
    });
  }


}


