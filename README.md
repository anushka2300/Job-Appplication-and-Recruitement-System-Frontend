# RecruitHub Frontend

A role-based React and Vite frontend for the Job Application and Recruitment System.

## Setup

```bash
npm install
copy .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL` to the backend origin, for example `http://localhost:5000`.

## Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run lint` - run Oxlint
- `npm run preview` - preview the production build

## Backend integration

The frontend integrates the backend endpoints for authentication, jobs, applications, and super-admin company operations. Authentication uses the JWT returned by `/api/auth/login` and sends it as a bearer token.

Backend-supported role names are `CANDIDATE`, `RECRUITER`, `ADMIN`, and `SUPER_ADMIN`. `ADMIN` is the company-admin role in the current backend.

### Super-admin company onboarding API

The super-admin dashboard expects these authenticated backend endpoints. List and detail responses use `{ "data": ... }`:

- `GET /api/admin/stats` returns `data` with `companiesCount`, `adminsCount`, and `pendingInvitationsCount`.
- `GET /api/companies` returns `data` as an array of companies with `id`, `name`, and optional `location` and `status`.
- `GET /api/companies/:id` returns `data` as a company with `id`, `name`, optional `description`, `website`, `location`, and an `admins` array containing `id`, `name`, and `email`.
- `GET /api/companies/invitations` returns `data` as an array with `id`, `companyId`, `companyName`, `adminName`, `adminEmail`, `role`, `status`, and optional `createdAt`.
- `POST /api/companies` creates a company.
- `POST /api/companies/invite_admin` creates a company invitation with `companyId`, `adminName`, `adminEmail`, and `role: "ADMIN"`.

The invitation acceptance endpoint remains `POST /api/companies/invitations/accept`. The backend should validate invitation tokens, activate the invited admin only after acceptance, and enforce role and company authorization server-side.
