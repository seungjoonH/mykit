# AWS Infra

## Rules
- Use least-privilege IAM roles by default.
- Separate environments by account or strict boundary.
- Keep infra changes reproducible via IaC.

## Do
- Use CloudWatch metrics/logs with service-level alarms.

## Don't
- Apply manual console-only changes without IaC sync.

## Example
```hcl
resource "aws_iam_role_policy" "app_read_s3" {
  role = aws_iam_role.app_role.id
  policy = data.aws_iam_policy_document.read_assets.json
}
```

## Boundaries
- IaC defines resources and permissions.
- App layer consumes provisioned resources only.

## Test Scope
- IAM permission simulation for critical actions.
- Health/alarm checks in staging.
