import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class Register {
    name = '';
    username = '';
    email = '';
    password = '';
    bio = '';
    skill = '';
    skills: string[] = [];
    errorMessage = '';
    suggestedUsername = '';
  
    constructor(
      private readonly authService: AuthService,
      private readonly router: Router
    ) {}
  
    addSkill() {
      if (this.skill.trim()) {
        this.skills.push(this.skill.trim());
        this.skill = '';
      }
    }
  
    submit() {
      console.log("Email being submitted:", this.email); 
      console.log("Skills being submitted:", this.skills);
    
      this.authService.register(
        this.name,
        this.username,   
        this.email,
        this.password,
        this.bio,       
        this.skills      
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);  
        },
        error: (err) => {
          console.log('Error details:', err);
          this.errorMessage = err?.error?.error || 'Registration failed';
          this.suggestedUsername = err?.error?.suggested_username || '';
        },
      });
    }
  }
