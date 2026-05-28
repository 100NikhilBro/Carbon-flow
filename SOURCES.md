# TRADEOFFS.md

# Tradeoffs & Limitations

## Synchronous Processing in Demo Deployment

The deployed free-tier version runs ingestion synchronously.

Reason:
Background workers on free infrastructure become unreliable or sleep frequently.

Production deployment should restore full Celery async execution.

---

## Shared Database Multi-Tenancy

Current implementation uses shared database + scoped queries.

Pros:

* Simpler deployment
* Lower cost

Cons:

* Weaker isolation compared to separate databases per tenant

---

## CSV Parsing Assumptions

Parsers currently assume semi-structured input formats.

A production-grade system would require:

* schema versioning
* stronger validation
* configurable mappings

---

## WebSocket Scaling

Current WebSocket implementation is suitable for demo-scale workloads.

Large-scale deployments would require:

* dedicated event infrastructure
* horizontal scaling strategy

---

## Audit Log Storage

Audit logs are stored in PostgreSQL.

Long-term enterprise systems may move logs to append-only storage or external observability platforms.
