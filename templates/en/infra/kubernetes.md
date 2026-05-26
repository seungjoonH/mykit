# Kubernetes Infra

## Rules
- Keep manifests declarative and environment-overridable.
- Enforce resource requests/limits for every workload.
- Treat rollout strategy and health probes as mandatory.

## Do
- Use ConfigMap/Secret references instead of hardcoded runtime values.

## Don't
- Deploy workloads without readiness/liveness probes.

## Example
```yaml
containers:
  - name: api
    image: ghcr.io/org/api:1.2.3
    resources:
      requests: { cpu: "100m", memory: "128Mi" }
      limits: { cpu: "500m", memory: "512Mi" }
```

## Boundaries
- Platform manifests own scheduling, scaling, and network policy.
- Application image owns process behavior.

## Test Scope
- Rolling update and rollback behavior.
- Probe failure and recovery scenarios.
