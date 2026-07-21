# MongoDB

## Rules
- Model documents around read/write access patterns.
- Keep schema validation rules even in flexible collections.
- Design compound indexes for actual filter/sort combinations.

## Do
- Keep document shape explicit with versioned fields when evolving schema.

## Don't
- Store unbounded arrays that grow without limits.

## Example
```ts
await users.updateOne(
  { _id: userId },
  { $set: { profile: payload, updatedAt: new Date() } },
  { upsert: false },
);
```

## Boundaries
- Collection schema/index policy belongs to data layer.
- Repository owns aggregation/query composition.
- Service owns document lifecycle rules.

## Test Scope
- Schema validation and backward compatibility.
- Index coverage for critical aggregations.
