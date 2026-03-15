# Job Platform – Freelance Marketplace Platform

Job Platform is a **freelance marketplace web application built with Angular** that integrates with a real REST API to simulate a complete freelance job marketplace workflow.

Users can create accounts, post jobs, submit proposals, hire freelancers, complete work, and review participants. The project demonstrates **API-driven frontend development, authentication flows, and scalable Angular architecture**.

The application mimics the core functionality of platforms like **Upwork** or **Fiverr**, focusing on the interaction between the **frontend client and backend services**.

---
# Screenshots

## Main Page


## Main Page – Statistics and Job Preview

## User Dashboard
![User Dashboard](screenshots/user-dashboard.png)

## User Postings
![User Postings](screenshots/user-postings.png)

---

# Key Capabilities

## Full Marketplace Workflow

SkillSwap implements the complete lifecycle of freelance work:

```
Job Creation → Proposal Submission → Hiring → Work Completion → Reviews
```

The application supports both **clients and freelancers**, allowing users to interact with the platform from different roles.

---

# Authentication & Secure API Communication

Authentication is handled using **JWT tokens**.

Features include:

- User registration and login
- Secure API requests with automatic token injection
- Authentication guards for protected routes
- Automatic redirect on authentication failures

Angular **HTTP interceptors** attach tokens to all authenticated requests.

---

# Job Marketplace

Users can explore and interact with freelance job listings.

Supported features include:

- Browsing available jobs
- Filtering job listings
- Viewing job details
- Creating new job postings
- Editing job information
- Managing personal job listings

---

# Proposal System

Freelancers can submit proposals for jobs posted by clients.

Capabilities include:

- Submitting proposals
- Viewing submitted proposals
- Withdrawing pending proposals
- Accepting a proposal as a job owner

Once a proposal is accepted, the job transitions to the next stage of the workflow.

---

# Job Lifecycle Management

Jobs progress through defined states:

```
open → in_progress → completed
```

This lifecycle ensures that the system maintains **clear job status tracking**.

---

# Review and Rating System

After job completion:

- Both participants can leave reviews
- Ratings range from **1–5**
- User ratings update automatically based on completed work

This mirrors the **reputation systems used in real freelance marketplaces**.

---

# Tech Stack

## Frontend

- Angular
- TypeScript
- SCSS
- Angular Router
- Reactive Forms
- RxJS
- HTTP Interceptors

---

# Backend API

The frontend integrates with a provided REST API:

```
https://stingray-app-wxhhn.ondigitalocean.app
```

Authentication is performed using:

```
Authorization: Bearer <JWT_TOKEN>
```

All business data is fetched from this backend API.

---

# Application Architecture

The project is structured using a **modular Angular architecture**.

This structure enables:

- Separation of concerns
- Reusable UI components
- Maintainable feature modules
- Scalable application growth

---

# Error Handling

The frontend gracefully handles API errors returned by the backend.

Handled responses include:

- **400** – Bad Request  
- **401** – Unauthorized  
- **403** – Forbidden  
- **404** – Not Found  
- **409** – Conflict  

Errors are surfaced through **clear UI feedback to the user**.

---

# Form Validation

All forms use **Angular Reactive Forms** for strong validation and state management.

Examples include:

- Required field validation
- Email format validation
- Password constraints
- Numeric validation for budgets
- Rating limits (1–5)
- Proposal price validation

---

# Running the Project

## 1. Clone the repository

```bash
git clone https://github.com/BettyDang/JobsPlatform.git
cd skillswap-platform
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the development server

```bash
ng serve
```

The application will run at:

```
http://localhost:4200
```

---

# Project Purpose

This project was developed to demonstrate:

- Full **frontend integration with a REST API**
- **Angular application architecture**
- **authentication and route protection**
- **stateful workflow management**
- **real-world freelance marketplace functionality**