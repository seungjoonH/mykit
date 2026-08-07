# Redis

## Rules
- Treat Redis as cache/session/queue store, not primary source of truth.
- Set TTL for cache keys unless explicitly persistent.
- Use namespaced keys and clear invalidation strategy.

## Do
- Keep key format stable (`app:domain:id`) and include TTL in write path.

## Don't
- Store large uncompressed blobs without size limits.

## Example
```ts
const key = `app:user:${userId}`;
await redis.set(key, JSON.stringify(user), { EX: 300 });
```

## Boundaries
- Service decides cacheability and invalidation events.
- Redis layer owns key schema, TTL, and serialization format.

## Test Scope
- TTL expiration and stale-read scenarios.
- Invalidation correctness after write operations.
