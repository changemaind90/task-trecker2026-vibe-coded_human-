# next-secure-check report

- Project: task-manager2026
- Framework: nextjs
- Score: 1/100
- Risk level: critical
- Findings: 16 (HIGH 4, MEDIUM 10, LOW 1, INFO 1)

## HIGH

### Environment file committed

- Location: `.env`
- Rule: `secrets/env-file-committed`
- Confidence: `HIGH`
- Context: `unknown`
- Why: Environment files may contain secrets and should not be committed.
- Context reason: no known file context pattern matched
- Evidence: `[REDACTED]`
- Recommendation: Remove committed environment files, rotate exposed secrets, and keep only .env.example templates in git.

### Login endpoint may be missing rate limiting

- Location: `src/app/api/auth/login/route.ts`
- Rule: `auth/login-without-rate-limit`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: Authentication endpoints are common brute-force targets and should be rate limited.
- Context reason: matched Next.js API route path
- Recommendation: Add per-IP and per-account rate limiting to login/auth endpoints.

### Login endpoint may be missing rate limiting

- Location: `src/app/api/auth/register/route.ts`
- Rule: `auth/login-without-rate-limit`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: Authentication endpoints are common brute-force targets and should be rate limited.
- Context reason: matched Next.js API route path
- Recommendation: Add per-IP and per-account rate limiting to login/auth endpoints.

### Register endpoint may be missing rate limiting

- Location: `src/app/api/auth/register/route.ts`
- Rule: `auth/register-without-rate-limit`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: Registration endpoints can be abused for spam accounts, brute force, or resource exhaustion and should be rate limited.
- Context reason: matched Next.js API route path
- Recommendation: Add per-IP and abuse-aware rate limiting to registration/signup endpoints.

## MEDIUM

### API route may be missing input validation

- Location: `src/app/api/auth/login/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `request.json()`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### Password handling without bcrypt or argon2 detected

- Location: `src/app/api/auth/login/route.ts:7`
- Rule: `auth/password-without-hashing-library`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: Password-related code exists, but bcrypt/argon2 dependency usage was not detected.
- Context reason: matched Next.js API route path
- Evidence: `const { email, password } = await request.json();`
- Recommendation: Hash passwords with argon2 or bcrypt and avoid storing or comparing plaintext passwords.

### API route may be missing input validation

- Location: `src/app/api/auth/register/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `request.json()`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### Password handling without bcrypt or argon2 detected

- Location: `src/app/api/auth/register/route.ts:7`
- Rule: `auth/password-without-hashing-library`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: Password-related code exists, but bcrypt/argon2 dependency usage was not detected.
- Context reason: matched Next.js API route path
- Evidence: `const { email, password, name } = await request.json();`
- Recommendation: Hash passwords with argon2 or bcrypt and avoid storing or comparing plaintext passwords.

### API route may be missing input validation

- Location: `src/app/api/projects/[id]/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `params`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### API route may be missing input validation

- Location: `src/app/api/projects/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `request.headers.get()`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### API route may be missing input validation

- Location: `src/app/api/tasks/[id]/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `params`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### API route may be missing input validation

- Location: `src/app/api/tasks/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `request.headers.get()`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### API route may be missing input validation

- Location: `src/app/api/telegram/webhook/route.ts`
- Rule: `validation/api-route-without-validation`
- Confidence: `MEDIUM`
- Context: `api-code`
- Why: API routes that consume user input should validate the input before using it.
- Context reason: matched Next.js API route path
- Evidence path: `request.json()`
- Recommendation: Add input validation with a schema library such as Zod, Yup, Joi, or a clear custom validation layer.

### dangerouslySetInnerHTML usage detected

- Location: `src/components/ui/chart.tsx:94`
- Rule: `xss/dangerously-set-inner-html`
- Confidence: `HIGH`
- Context: `unknown`
- Why: Rendering raw HTML can introduce XSS if the content is user-controlled.
- Context reason: no known file context pattern matched
- Evidence: `dangerouslySetInnerHTML={{`
- Recommendation: Avoid raw HTML rendering or sanitize trusted markup with a proven sanitizer.

## LOW

### Security headers were not detected

- Location: `middleware.ts`
- Rule: `headers/missing-security-headers`
- Confidence: `LOW`
- Context: `unknown`
- Why: Missing common security header configuration: Content-Security-Policy, frame protection, X-Content-Type-Options, Referrer-Policy, Permissions-Policy. Runtime, hosting, and reverse-proxy headers were not evaluated. This is a bounded review signal, not proof that every response omits these headers.
- Context reason: no known file context pattern matched
- Evidence: `No recognized static Next.js security header configuration found.`
- Recommendation: Configure Content-Security-Policy, frame protection, X-Content-Type-Options, Referrer-Policy, and Permissions-Policy.

## INFO

### X-Powered-By header may be enabled

- Location: `next.config.ts`
- Rule: `config/next-powered-by-header`
- Confidence: `MEDIUM`
- Context: `unknown`
- Why: The default X-Powered-By header can reveal framework information. Hiding it is a small hardening step.
- Context reason: no known file context pattern matched
- Recommendation: Set poweredByHeader: false in next.config.js to reduce framework fingerprinting.