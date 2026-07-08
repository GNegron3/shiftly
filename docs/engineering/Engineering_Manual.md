# Shiftly Engineering Manual
**Version 1.0 — Official Master Manual**

---

## Chapter 1 — Engineering Philosophy

### Purpose

This manual defines the engineering standards used to build and maintain Shiftly. Its purpose is to ensure every contributor follows the same architectural principles, coding standards, and development workflow. Whenever implementation decisions are unclear, this manual should be consulted before development continues.

---

### Engineering Mission

Build software that is simple, reliable, secure, and maintainable. Every engineering decision should improve the long-term quality of the product rather than optimize only for short-term speed.

---

### Engineering Principles

**Build for the Long Term** — Code should be written with future growth in mind. Avoid temporary solutions that create unnecessary technical debt. Prefer maintainable solutions over clever ones.

**Simplicity Wins** — Choose the simplest solution that fully solves the problem. Complexity should only be introduced when it provides clear value.

**Consistency Over Preference** — Individual coding preferences should never override documented standards. A consistent codebase is easier to understand, maintain, and extend.

**Reuse Before Rebuild** — Before creating a new component, utility, or service, determine whether an existing solution can be reused. Avoid duplicate logic whenever possible.

**Security by Default** — Security is part of implementation — not an enhancement added later. Protect user data at every layer of the application.

**Performance Matters** — Every feature should be designed with performance in mind. Avoid unnecessary network requests, redundant rendering, and inefficient database queries. Optimization should not sacrifice readability, but poor performance should never become the standard.

---

### Engineering Priorities

When priorities conflict, follow this order:

1. Correctness
2. Security
3. Simplicity
4. Maintainability
5. Performance
6. Developer Convenience

---

### Core Development Rules

- Build one milestone at a time
- Complete one feature before beginning another
- Keep pull requests and commits focused
- Never leave partially implemented functionality
- Remove dead code instead of commenting it out
- Fix the root cause whenever practical
- Write code that explains itself through clear naming

---

### Documentation Rule

Every meaningful architectural or engineering decision must be documented before development continues. Documentation is part of the deliverable — not a task completed afterward.

---

### Definition of Done

A feature is considered complete only when:

- Requirements have been implemented
- Edge cases have been considered
- Errors are handled gracefully
- Manual testing has passed
- Documentation has been updated
- The feature is ready for the next milestone

---

## Chapter 2 — Project Structure & Architecture Standards

### Purpose

This chapter defines how the Shiftly codebase is organized. A consistent project structure improves readability, reduces onboarding time, and makes the application easier to maintain as it grows.

---

### Architecture Philosophy

Shiftly follows a modular architecture. Each part of the application should have a single responsibility. Features should be organized by purpose rather than convenience.

---

### Core Principles

**Single Responsibility** — Every file, component, hook, and utility should have one clear purpose.

**Separation of Concerns** — User interface, business logic, database operations, and utilities should remain separate whenever practical.

**Reusable Components** — If functionality is used in multiple places, it should become a reusable component rather than duplicated code.

**Predictable Organization** — A developer should be able to locate any file without searching the entire project.

---

### Project Structure

```
app/          Screens and navigation. No business logic.
components/   Reusable UI components.
hooks/        Reusable React hooks. Business logic shared across screens.
services/     Application services. Interactions with external systems.
lib/          Shared helper functions. Independent of application state.
types/        TypeScript types and interfaces.
constants/    Values that rarely change.
assets/       Static application assets.
supabase/     Supabase configuration and client initialization.
docs/         Project documentation stored alongside the codebase.
```

---

### Naming Standards

Use descriptive names. Prefer clarity over brevity.

**Good:** `ProfessionalProfileCard`, `WeeklySchedule`, `UpdateScheduleButton`

**Avoid:** `Card1`, `DataHelper`, `TempComponent`

---

### Import Standards

Imports should follow a consistent order:

1. External libraries
2. Internal services
3. Components
4. Hooks
5. Utilities
6. Types
7. Constants
8. Styles

---

### Architecture Standards

- Database before UI
- Business logic outside components
- Components remain presentation-focused
- Shared logic belongs in hooks or services
- Minimize duplication
- Favor composition over large components

---

## Chapter 3 — Technology Stack & Standards

### 3.1 Core Technology Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (managed workflow) |
| Language | TypeScript (strict mode) |
| Navigation | Expo Router |
| UI | Native components + custom component library |
| Backend | Supabase |
| Database | PostgreSQL (managed via Supabase) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Edge Functions | Supabase Edge Functions (when required) |

---

### 3.2 Development Environment

- Local Development
- Staging (optional)
- Production

Production data must never be used during local development. Environment variables must be separated by environment.

---

### 3.3 TypeScript Standards

- Strict mode enabled
- Avoid `any`
- Prefer explicit typing
- Shared interfaces when applicable
- Strong typing across API boundaries

---

### 3.4 Expo Standards

Use Expo-managed workflow whenever possible. Avoid unnecessary native modules. Native code should be introduced only when no stable Expo solution exists.

---

### 3.5 Security Standards

- Least privilege
- Secure defaults
- Encrypted communication
- Server-side authorization
- Input validation
- Output sanitization

---

### 3.6 Performance Standards

- Minimize unnecessary renders
- Reduce network requests
- Lazy load when appropriate
- Optimize database queries
- Keep bundle size manageable
- Cache where appropriate

---

## Chapter 4 — Coding Standards

### 4.1 General Principles

Every line of code should prioritize:
- Readability over cleverness
- Simplicity over abstraction
- Explicit behavior over hidden logic
- Small, reusable components
- Predictable structure
- Consistent formatting

---

### 4.2 File Size

- Components: generally under 300 lines
- Hooks: focused on one concern
- Utilities: small and reusable
- API files: one domain per file

---

### 4.3 Functions

- Keep functions short
- Minimize side effects
- Prefer pure functions when possible
- Return early instead of deeply nested conditionals
- Avoid duplicated logic

---

### 4.4 Components

Each component should have one responsibility. Components should receive data through props, avoid unnecessary internal state, remain reusable, and be easy to test independently.

---

### 4.5 Comments

Comments are reserved for:
- Business rules
- Non-obvious decisions
- Complex algorithms
- Temporary TODOs with context

Do not comment obvious code.

---

### 4.6 Constants

Avoid hardcoded values. Shared values should be extracted into constants: colors, sizes, route names, limits, status values, default settings.

---

### 4.7 Error Prevention

Validate inputs before performing operations. Never assume external data is valid. Guard against null values, undefined values, invalid IDs, missing objects, empty arrays, failed network requests.

---

### 4.8 Async Code

- Always handle failures
- Await asynchronous calls explicitly
- Avoid deeply chained promises
- Keep asynchronous logic isolated
- Loading and error states must always be considered

---

### 4.9 Security

Never expose secrets, trust client input, bypass authorization, store sensitive information insecurely, or leak internal errors to users. Validate all external inputs.

---

### 4.10 Dead Code

Dead code is not permitted. Remove unused variables, unused functions, deprecated components, commented-out implementations, and obsolete feature flags. Version control preserves history.

---

### 4.11 Consistency

When contributing to an existing module: follow existing patterns, match naming conventions, match architectural decisions, match formatting, match folder organization.

---

## Chapter 5 — Naming Conventions

### General Principles

- Prefer descriptive names that clearly communicate purpose
- Use complete words — avoid unnecessary abbreviations
- One concept, one name throughout the project

---

### File Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `ScheduleCard.tsx` |
| Hooks | camelCase with `use` prefix | `useSchedule.ts` |
| Utilities | camelCase | `formatDate.ts` |
| Services | camelCase with `Service` suffix | `authService.ts` |
| Types | PascalCase | `Schedule.ts` |
| Constants | camelCase (objects) / UPPER_SNAKE_CASE (primitives) | `routeConfig.ts` / `MAX_UPLOAD_SIZE` |

---

### Variable Naming

**Variables:** `currentUser`, `workerSchedule`, `selectedDay`

**Booleans:** `isLoggedIn`, `hasNotifications`, `canEditProfile`

**Functions:** `createWorker()`, `updateSchedule()`, `deleteNotification()`

**Event handlers:** `handleSubmit`, `handlePress`, `handleSave`

**Async functions:** `fetchProfile()`, `loadSchedule()`, `saveAvailability()`

---

### Component & Screen Naming

- Components use nouns: `ScheduleCard`, `ProfileHeader`
- Screens end with `Screen`: `HomeScreen`, `ProfileScreen`
- Hooks always begin with `use`: `useAuth`, `useSchedule`
- Context follows `FeatureContext` / `FeatureProvider` pattern

---

### Database Naming

| Element | Convention | Example |
|---|---|---|
| Tables | lowercase plural nouns | `users`, `schedules` |
| Columns | snake_case | `created_at`, `user_id` |
| Boolean columns | `is_` / `has_` / `can_` prefix | `is_verified`, `has_schedule` |

---

### API Naming

- Endpoints use plural resources: `/api/workers`, `/api/schedules`
- URLs use lowercase kebab-case: `/my-schedule`, `/edit-profile`
- Environment variables use UPPER_SNAKE_CASE: `SUPABASE_URL`

---

### Git Naming

| Type | Convention | Example |
|---|---|---|
| Branch | lowercase kebab-case with prefix | `feature/worker-profile` |
| Commit | Conventional Commits, imperative tense | `feat(profile): add sharing button` |

---

## Chapter 6 — State Management

### Principles

- Single source of truth
- Minimal state
- Predictable updates
- Server data stays on the server
- UI state stays local whenever possible
- Derived values should not be stored
- State should flow downward through the component tree

---

### Types of State

**Local UI State** — Lives inside a single component. Use `useState()`. Examples: modal visibility, selected tab, input values.

**Shared Client State** — Data used by multiple unrelated components. Use React Context and custom hooks. Examples: authenticated user, theme, notification queue.

**Server State** — Data owned by Supabase. Never duplicate ownership. Supabase remains the source of truth. Examples: profiles, shifts, followers.

**Derived State** — Computed from existing state. Never store values that can be derived.

---

### State Ownership

Every state value has exactly one owner. Lift state upward only when multiple components require it. Lift to the nearest common parent — not the application root unless necessary.

---

### Global State Standards

Only globalize state that is shared, long-lived, frequently accessed, and user/session related. Examples: auth user, current workplace, feature flags, app settings.

---

### Server State Standards

Components should consume data through reusable hooks instead of performing direct fetches.

```
useSchedule()
    ↓
Supabase
    ↓
Component
```

---

### Loading, Empty, and Error States

Every async operation must define loading behavior. Empty data is not an error — provide useful messaging. Every server operation should expose errors consistently and surface meaningful feedback.

---

### Optimistic Updates

Use optimistic updates when user experience benefits from immediate feedback. Always support rollback on failure.

---

### Custom Hooks

State logic should live in reusable hooks whenever multiple components require the same behavior. Hooks should encapsulate fetching, loading state, error handling, mutations, derived values, and refresh behavior.

---

### State Flow

```
Supabase → Custom Hook → Screen Component → Presentation Components
    ↑                                               ↓
    └─────────────── Mutation ──────────────────────┘
```

---

## Chapter 7 — Database Standards

### Philosophy

- Normalize by default
- Enforce relationships with constraints
- Store each piece of information once
- Design for long-term scalability
- Optimize only after measuring performance
- Keep business logic outside the database whenever practical

---

### Table Naming

Tables use lowercase snake_case plural nouns: `users`, `restaurants`, `shifts`, `guest_connections`.

---

### Primary Keys

Every table uses a UUID primary key: `id UUID PRIMARY KEY DEFAULT gen_random_uuid()`. Never use email, username, or phone number as primary keys.

---

### Required Metadata Columns

Most business tables include: `id`, `created_at`, `updated_at`. When applicable: `deleted_at`, `created_by`, `updated_by`.

---

### Timestamp Standards

Store timestamps in UTC. `created_at` never changes. `updated_at` updates automatically. `deleted_at` is null until soft deletion.

---

### Soft Deletes

Default to soft delete (`deleted_at TIMESTAMP NULL`). Use hard deletes only when legally required, for temporary data, or for cache/cleanup jobs.

---

### Constraints

Use database constraints whenever possible: `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY`. Business rules should not rely solely on application validation.

---

### Indexing Standards

Index: primary keys, foreign keys, frequently filtered columns, frequently sorted columns, frequently joined columns. Avoid excessive indexing — every index has maintenance cost.

---

### Migration Standards

Every schema change requires a migration. Migrations must be deterministic, reversible when practical, committed to version control, and reviewed before deployment. Never modify production tables manually.

---

### Security

- Least privilege
- Foreign key enforcement
- Row-level security where applicable
- Encrypted connections
- Parameterized queries
- No dynamic SQL from user input
- Sensitive data minimized
- Secrets never stored in plaintext

---

## Chapter 8 — Supabase Standards

### Purpose

Supabase is Shiftly's backend platform providing: PostgreSQL database, authentication, authorization, Row Level Security, storage, realtime, edge functions, and database migrations.

---

### Role of Supabase

Supabase is responsible for user authentication, user authorization, persistent application data, file storage, secure backend execution, realtime synchronization, and database security.

Business logic remains in the application unless security or backend execution requires otherwise.

---

### Environment Separation

- Never test against Production
- Never share Production keys locally
- Production data is never used during development
- Development projects may be reset; Production projects must never be reset

---

### Authentication Standards

Authentication is managed exclusively by Supabase Auth. Application code never stores passwords, password hashes, or session tokens. Authentication state comes only from the authenticated Supabase client.

---

### Row Level Security (RLS) Standards

RLS is enabled on every user-facing table. No exceptions. Policies should default to deny. Access is explicitly granted.

**Policy Design Principles:**
- Simple, explicit, minimal, predictable, easy to audit
- Multiple small policies are preferred over one complex policy
- Users read, update, and delete only their own data

---

### Service Role Usage

The Service Role bypasses RLS. Only trusted backend environments may use it. Never expose Service Role Key, Admin Key, or backend secrets to the frontend.

---

### Edge Functions Standards

Edge Functions are used when secrets are required, third-party APIs are called, sensitive operations occur, or scheduled work executes. Edge Functions should remain stateless, small, focused, and independently testable.

---

### Supabase Client Usage

A single client instance should exist per environment. Application code imports the shared client from `lib/supabase.ts`.

---

### Storage Standards

Supabase Storage is used only for user-uploaded assets. Buckets should represent asset categories (`avatars`, `restaurants`, `events`). Files should use predictable unique names (`userId/uuid.jpg`).

---

### Migrations with Supabase

All schema changes require migrations. Never manually edit Production. Migration history must remain complete.

---

### Security Best Practices

- Always enable RLS
- Validate user ownership
- Use least privilege
- Keep secrets private
- Validate uploaded files
- Limit backend privileges
- Never trust client input

---

## Chapter 9 — API Standards

### API Philosophy

- Simplicity over flexibility
- Consistency over convenience
- Explicit behavior over hidden logic
- Stable contracts over frequent changes
- Security by default

---

### REST Conventions

Resources are nouns. Actions are represented through HTTP methods.

| Method | Use |
|---|---|
| GET | Retrieve resource |
| POST | Create resource |
| PATCH | Partial update |
| PUT | Full update |
| DELETE | Remove resource |

---

### URL Structure

```
/api/v1/resource
/api/v1/resource/{id}
/api/v1/resource/{id}/children
```

---

### Response Structure

**Success:**
```json
{ "data": { ... } }
```

**Collection:**
```json
{ "data": [], "pagination": {} }
```

**Error:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email is required.",
    "details": []
  }
}
```

---

### Authentication & Authorization

- Protected endpoints require authentication
- Authentication is verified before business logic
- Every endpoint validates ownership, role, permissions, and resource access
- Never rely solely on frontend restrictions

---

### Pagination Standards

Large collections require pagination using `limit` and `cursor`. Avoid offset pagination where scalability is important.

---

### Versioning Philosophy

Shiftly versions APIs only when breaking changes occur. Format: `/api/v1/`. Minor additions should not require new versions.

---

## Chapter 12 — Testing Standards

### Testing Philosophy

- Reliability over coverage percentages
- Behavior over implementation details
- Deterministic results
- Fast feedback
- Maintainable test suites
- Regression prevention

---

### Testing Pyramid

```
End-to-End Tests      ▲ (minimal but comprehensive)
Integration Tests     ▲ (fewer)
Unit Tests            ▲ (many)
```

---

### Unit Testing Standards

Unit tests verify isolated business logic. They should run quickly, have no network or database dependencies, produce deterministic results, and test one behavior per test.

---

### Integration Testing Standards

Integration tests verify multiple components working together: API + database, authentication + permissions, state + UI, repository + service layer.

---

### End-to-End Testing Standards

Only critical user journeys should be covered. Examples: user registration, login, schedule creation, profile editing, notification delivery.

---

### Authentication & Authorization Testing

- Verify login, logout, session refresh, token expiration, invalid credentials
- Verify users can access only their own data
- Always test permission boundaries

---

### Mocking Standards

Mock only external dependencies: APIs, third-party services, push notifications, payment providers, email providers. Avoid mocking internal business logic whenever possible.

---

### Test Naming Conventions

Test names should describe observable behavior.

**Good:** `creates_schedule_when_shift_is_valid`, `returns_401_without_authentication`

**Avoid:** `test1`, `scheduleTest`, `worksProperly`

---

### CI Testing Expectations

Every pull request should verify: linting, type checking, unit tests, integration tests, and build success. No failing tests should be merged.

---

## Chapter 13 — Git Workflow

### Git Workflow Philosophy

- Main is always deployable
- Features are developed independently
- Changes are reviewed before merging
- Every commit has a clear purpose
- History should remain readable

---

### Branch Strategy

```
main
├── feature/auth-refactor
├── feature/notifications
├── fix/login-validation
└── hotfix/payment-crash
```

---

### Branch Naming Conventions

| Prefix | Use |
|---|---|
| `feature/` | New features |
| `fix/` | Bug fixes |
| `hotfix/` | Critical production fixes |
| `docs/` | Documentation updates |
| `refactor/` | Code refactoring |
| `chore/` | Maintenance tasks |

---

### Commit Standards

Use Conventional Commits format with imperative tense.

**Format:** `type(scope): description`

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

**Examples:**
- `feat(profile): add share button`
- `fix(schedule): correct timezone conversion`
- `docs(engineering): update state management chapter`

---

### Pull Request Requirements

Every PR should include: clear description, reason for change, testing performed, related issue (if applicable), screenshots for UI changes, documentation updates when required.

---

### Merge Strategy

Use squash merge for feature branches. Benefits: cleaner history, easier rollback, one commit per completed feature.

---

### Protected Branch Rules

Main branch requires: pull request approval, passing CI, no direct pushes, no force pushes.

---

### Secrets Management

Secrets never belong in Git. If a secret is committed: rotate the credential immediately, remove it from history if appropriate, update affected systems, document the incident.

---

## Chapter 14 — AI Coding Workflow

### 14.1 Purpose

AI is a development accelerator, not a decision maker. Shiftly uses AI to increase engineering velocity while maintaining consistent architecture, predictable code quality, and human ownership of every implementation.

All generated code must meet the same engineering standards as manually written code.

---

### 14.2 AI Engineering Philosophy

AI assists. Engineers decide. Speed must never compromise architecture.

Every implementation should prioritize: simplicity, consistency, readability, maintainability, scalability, and predictability.

---

### 14.3 Human Ownership

Engineers remain responsible for: product decisions, architecture, database design, security, testing, performance, code review, and production quality. AI never owns code.

---

### 14.4 AI Roles Within Shiftly

**AI may assist with:** feature implementation, component creation, refactoring, boilerplate generation, unit tests, documentation, SQL generation, type generation, API implementation, debugging suggestions, error analysis.

**AI should not determine:** product direction, business logic, database architecture, security models, access policies, or technical strategy.

---

### 14.5 Context-First Development

AI should never begin implementation without project context. Required context includes: Company Manual, Engineering Manual, Product Requirements, System Architecture, Database Architecture, existing project structure, and current feature scope.

---

### 14.6 Documentation as Source of Truth

AI follows documentation. Documentation does not follow AI. If documentation and generated code conflict: documentation wins.

---

### 14.7 AI Coding Rules

Generated code must:
- Follow naming standards
- Match project architecture
- Use existing patterns
- Respect folder structure
- Remain strongly typed
- Avoid duplication
- Handle errors correctly
- Include loading states
- Include empty states where appropriate
- Support future maintenance

---

### 14.8 Architectural Consistency

AI should extend existing architecture. Never replace architecture simply because another solution is possible. Consistency is more valuable than novelty.

---

### 14.9 Incremental Implementation

Large features should be built in small, reviewable steps:

1. Data model
2. API
3. Business logic
4. UI
5. Testing
6. Documentation

---

### 14.10 Hallucination Prevention

AI must never invent: database tables, API endpoints, environment variables, design decisions, product requirements, existing utilities, or business rules.

If required information is unavailable: stop and request clarification. Never guess.

---

### 14.11 Security Expectations

AI-generated code must never: expose secrets, bypass authorization, disable validation, ignore RLS, hardcode credentials, or leak sensitive information.

---

### 14.12 Privacy and Sensitive Information

Never provide AI with: production secrets, API keys, access tokens, customer personal information, payment information, or private credentials. Use placeholders or sanitized examples whenever possible.

---

### 14.13 Working with Claude

Claude is Shiftly's primary coding assistant. Claude should:
- Follow the Company Manual
- Follow the Engineering Manual
- Follow the PRD
- Preserve architecture
- Generate production-quality code
- Work incrementally
- Explain tradeoffs when necessary
- Request clarification instead of making assumptions

Claude is an implementation partner, not an autonomous software architect.

---

### 14.14 AI Coding Workflow

**Before implementation:**
- Review Company Manual
- Review Engineering Manual
- Review PRD
- Review architecture documentation
- Understand existing implementation
- Confirm feature scope

**During implementation:**
- Follow established patterns
- Generate strongly typed code
- Maintain architectural consistency
- Implement incrementally
- Handle errors correctly
- Avoid unnecessary abstractions

**Before completion:**
- Review generated code
- Verify logic
- Run tests
- Confirm linting passes
- Confirm type checking passes
- Update documentation
- Validate against project standards

---

## Chapter 15 — Definition of Done

### 15.1 Purpose

The Definition of Done defines the minimum engineering standard required before any work can be merged into the main branch. A feature is complete only when it satisfies every engineering standard established by this manual.

---

### 15.2 Required Completion Criteria

Work is considered complete only when:
- Requirements are fully implemented
- Edge cases are handled
- Errors are handled gracefully
- Code follows Shiftly standards
- Tests pass
- Build succeeds
- Code is review-ready
- Application is production-ready

---

### 15.3 Code Quality Requirements

Production code must be readable, modular, reusable, predictable, and consistent.

Avoid: dead code, large functions, duplicate logic, magic values, deep nesting, unused imports, unused variables.

---

### 15.4 Architecture Compliance

All work must follow the approved architecture. Do not introduce new architectural patterns, bypass application layers, duplicate existing services, or create parallel systems.

---

### 15.5 Definition of Done Checklist

**Functionality**
- [ ] Feature requirements complete
- [ ] Acceptance criteria satisfied
- [ ] Edge cases handled
- [ ] Failure cases handled

**Code Quality**
- [ ] Clean code
- [ ] No dead code
- [ ] No duplication
- [ ] Small, maintainable functions
- [ ] Readable implementation

**Architecture**
- [ ] Follows approved architecture
- [ ] No unnecessary abstractions
- [ ] No architectural violations

**Standards**
- [ ] Coding Standards followed
- [ ] Naming Standards followed
- [ ] State Management Standards followed
- [ ] Database Standards followed
- [ ] Supabase Standards followed
- [ ] API Standards followed
- [ ] Component Standards followed
- [ ] Error Handling Standards followed
- [ ] Testing Standards followed

**User Experience**
- [ ] Loading states complete
- [ ] Error states complete
- [ ] Empty states complete
- [ ] Responsive layouts verified
- [ ] Accessibility verified

**Performance**
- [ ] No unnecessary renders
- [ ] Efficient queries
- [ ] Performance acceptable

**Security**
- [ ] Authorization verified
- [ ] Validation complete
- [ ] Sensitive data protected

**Testing**
- [ ] Tests pass
- [ ] Manual verification complete
- [ ] No regressions found

**AI Code**
- [ ] AI output fully reviewed
- [ ] Hallucinated code removed
- [ ] Generated code refactored where needed

**Review**
- [ ] Reviewer-ready
- [ ] Comments resolved
- [ ] No debug code
- [ ] No TODOs
- [ ] Clean commit history

**Build**
- [ ] Lint passes
- [ ] Type checking passes
- [ ] Build succeeds
- [ ] Deployment succeeds

**Production**
- [ ] Production ready

---

### 15.6 When Work Is NOT Considered Done

Work is not complete if:
- Code compiles but is untested
- Happy path only is implemented
- TODOs remain
- Debug code remains
- Console logging remains
- Standards are violated
- Documentation is outdated
- Accessibility is ignored
- Responsive layouts are broken
- Errors are unhandled
- Review feedback is unresolved
- Build fails
- Deployment fails

"Mostly finished" is not finished.

---

## Revision History

| Version | Description |
|---|---|
| 1.0 | Foundation draft. Establishes engineering philosophy, project structure, technology stack, coding standards, naming conventions, state management, database standards, Supabase standards, API standards, testing standards, Git workflow, AI coding workflow, and Definition of Done. |
