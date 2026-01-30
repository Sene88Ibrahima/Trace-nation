# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Trace Nation is a budget transparency platform for Senegal's government, enabling fraud detection and financial traceability. Built with React, TypeScript, Vite, and Supabase.

## Development Commands

```bash
npm run dev       # Start dev server on port 8080
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview built app
```

## Tech Stack

- **Framework:** React 18.3 + TypeScript 5.8 + Vite 5.4
- **UI:** shadcn/ui components + Tailwind CSS + Radix UI primitives
- **Backend:** Supabase (PostgreSQL + Auth)
- **State:** TanStack React Query for server state
- **Forms:** React Hook Form + Zod validation
- **Routing:** React Router DOM 6.30 with v7 future flags enabled

## Architecture

### Path Alias
`@/*` maps to `src/*` (configured in vite.config.ts and tsconfig.json)

### Key Directories
- `src/components/ui/` - shadcn/ui components (do not modify directly, use CLI to add new ones)
- `src/pages/` - Route pages including auth/ and admin/ subdirectories
- `src/hooks/useAuth.tsx` - Authentication hook with role management
- `src/integrations/supabase/` - Supabase client and auto-generated types

### Authentication & Roles
The app uses Supabase Auth with role-based access control:
- **Roles:** `citoyen` (citizen), `admin`, `superadmin`
- **useAuth hook:** Provides `user`, `session`, `role`, `signIn`, `signUp`, `signOut`
- **ProtectedRoute component:** Wraps routes with role checking

```tsx
<ProtectedRoute requiredRole="admin">
  <AdminPage />
</ProtectedRoute>
```

### Route Structure
- Public: `/`, `/about`
- Auth: `/login`, `/register`, `/forgot-password`, `/reset-password`
- Protected (citizen+): `/dashboard`, `/budget`, `/payments`, `/fraud-detection`, `/citizen-portal`, `/project/:id`
- Admin only: `/admin/users`, `/admin/create-admin`, `/audit`

### Design System
HSL-based color variables defined in `src/index.css`:
- Primary: Forest green (`hsl(145 45% 25%)`)
- Secondary/Accent: Yellow tones
- Fonts: Space Grotesk (headings), Inter (body)

## Supabase Setup

Environment variables required in `.env`:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

Database tables:
- `user_roles` - Maps users to roles (citoyen/admin/administration)
- `profiles` - User profile data

See `SUPABASE_SETUP.md` for full database configuration.

## TypeScript Configuration

The project uses relaxed TypeScript settings:
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`
