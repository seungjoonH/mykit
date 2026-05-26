# Vercel Infra

## Rules
- Keep environment variables scoped by environment.
- Use preview deployments for every PR.
- Promote from validated preview to production.

## Do
- Configure project-level build/runtime settings in source-controlled config.

## Don't
- Ship production-only changes directly without preview verification.

## Example
```json
{
  "framework": "nextjs",
  "functions": {
    "app/api/**/route.ts": { "maxDuration": 30 }
  }
}
```

## Boundaries
- Vercel project config owns deployment/runtime policy.
- App code owns framework behavior and endpoints.

## Test Scope
- Preview URL smoke tests.
- Production env variable completeness checks.
