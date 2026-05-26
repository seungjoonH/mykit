# Azure Infra

## Rules
- Enforce least-privilege RBAC and managed identities.
- Split workloads by resource group and environment policy.
- Keep infra declarative with Bicep/Terraform.

## Do
- Centralize diagnostics with Azure Monitor and Log Analytics.

## Don't
- Use owner-level permissions for app runtime identities.

## Example
```bicep
resource appIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'app-identity'
  location: resourceGroup().location
}
```

## Boundaries
- Platform layer owns identity and network policy.
- Application layer owns deployable artifacts only.

## Test Scope
- RBAC assignment validation.
- Diagnostic and alert rule coverage.
