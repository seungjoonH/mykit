# GCP Infra

> Supports both GCE VM + Docker Compose and Cloud Run/GKE deployments.
> Terraform/IaC, fine-grained IAM, and Cloud Monitoring alerts are recommended as scale grows.

## Rules

- Declare the deployment entrypoint (deploy script, GitHub Actions workflow) and runtime env var source.
- Never commit secrets to the repo — inject them at deploy time (GitHub Secrets, Secret Manager, etc.).
- Document service boundaries: reverse proxy, app, worker, redis, db connections.
- Run `docker compose config` or equivalent validation before deploying.
- Mask secret URLs/tokens/passwords in production logs.
- Do not grant broad editor permissions to runtime services.

## Do

- GCE VM deployment: run `docker compose pull && docker compose up -d` in the deploy script.
- Inject env vars via a `.env` file on the VM or from Secret Manager.
- Keep network boundaries explicit per environment (dev/staging/prod).
- At scale: manage infrastructure through Terraform or equivalent IaC; apply least-privilege service accounts.
- At scale: use Cloud Logging and Cloud Monitoring with alert policies.

## Don't

- Don't hardcode secrets inline in scripts — always use env var indirection.
- Don't manually SSH into the VM to edit files — go through the deploy pipeline.
- Don't grant project-level editor to a single service account.

## Example

```yaml
# GitHub Actions steps: validate compose config then deploy to GCE VM
- name: Validate compose config
  run: docker compose -f docker-compose.prod.yml config --quiet

- name: Deploy to VM
  run: |
    ssh ${{ secrets.VM_USER }}@${{ secrets.VM_HOST }} "
      cd /app &&
      docker compose pull &&
      docker compose up -d --remove-orphans
    "
```

## Boundaries

- The deploy pipeline (GitHub Actions, etc.) owns env var injection and compose startup.
- Runtime services expose only explicitly permitted ports/networks.
- Before Terraform/IaC: track VM config changes via PR or commit history.

## Test Scope

- Health check endpoint responds after deploy.
- Container fails to start on missing env vars.
- Secrets are not printed in logs.
