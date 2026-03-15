import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { guestGuard } from './guards/guest-guard';
import { authGuard} from './guards/auth-guard';
import { JobSearch } from './components/job-search/job-search';
import { CreateJob } from './components/create-job/create-job';
import { JobDetails } from './components/job-details/job-details';
import { UserProfile } from './components/user-profile/user-profile';
import { MyJob } from './components/my-job/my-job';
import { JobEdit } from './components/job-edit/job-edit';
import { JobList } from './components/job-list/job-list';
import { PlatformStatsComponent } from './components/platform-stats/platform-stats';



export const routes: Routes = [
  { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },

  { path: 'jobs/search', component: JobSearch, canActivate: [authGuard] },
  { path: 'jobs/create', component: CreateJob, canActivate: [authGuard] },

  { path: 'jobs/:id/edit', component: JobEdit, canActivate: [authGuard] },
  { path: 'jobs/:id', component: JobDetails, canActivate: [authGuard] },
  { path: 'jobs', component: JobList, canActivate: [authGuard] },
  
  { path: 'my-jobs', component: MyJob, canActivate: [authGuard] },
  { path: 'users', component: UserProfile, canActivate: [authGuard] },

  { path: 'platform', component: PlatformStatsComponent, canActivate: [authGuard] },
  
  { path: '**', redirectTo: 'jobs' }

  ];



// export const routes: Routes = [

//     { path: 'login', component: Login },
//     { path: 'signup', component: Signup },

// ];


// {path: 'login', component: Login, canActivate: [guestGuard]},
// {path: 'signup', component: Signup, canActivate: [guestGuard]},