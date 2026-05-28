# TRADEOFFS.md

# Tradeoffs & Engineering Compromises

This project was built as a time-constrained ESG ingestion prototype focused on demonstrating:

* multi-tenancy
* RBAC
* ingestion pipelines
* validation workflows
* audit logging
* scalable backend architecture

Several engineering tradeoffs were intentionally made to keep the system deliverable within the assignment timeline while still preserving production-oriented design decisions.

---

# 1. Async Queue Architecture Designed but Not Fully Deployed

The ingestion pipeline was originally designed around:

* Celery workers
* Redis queue
* asynchronous background processing

Intended architecture:

```text
Upload → Queue → Worker → Validation → Processing → DB
```

This architecture isolates heavy CSV processing from the API request lifecycle and improves:

* throughput
* latency
* scalability
* fault isolation

However, the deployed version currently runs ingestion synchronously.

## Why

Free-tier hosting platforms created infrastructure limitations for background workers.

Multiple deployment approaches were explored including:

* Render workers
* Railway
* Fly.io
* Heroku alternatives

Most stable worker-based deployments required:

* paid infrastructure
* managed Redis setup
* more advanced DevOps configuration

Due to assignment timeline constraints, synchronous ingestion was selected for deployment.

## Known Tradeoffs

| Problem             | Impact                                  |
| ------------------- | --------------------------------------- |
| Tight coupling      | API waits for ingestion completion      |
| Higher latency      | Upload requests become slower           |
| Lower throughput    | Fewer concurrent uploads                |
| Increased CPU usage | Parsing occurs inside request lifecycle |

Even though deployment is synchronous, the internal architecture was intentionally designed around queue-worker separation.

In production, queue-based ingestion would still be preferred because it supports:

* horizontal worker scaling
* retry mechanisms
* workload isolation
* backpressure handling
* fault tolerance

Under heavy ingestion traffic, producer speed may become faster than consumer processing speed, creating backpressure and resource exhaustion risks.

---

# 2. CSV Chosen as Universal Ingestion Contract

Real ESG systems receive data from multiple enterprise formats:

* SAP IDoc exports
* OData APIs
* PDFs
* Excel sheets
* vendor APIs
* XML exports

Instead of supporting all formats, this prototype standardizes ingestion through CSV files.

## Why

CSV provided the fastest and most stable ingestion contract within the assignment timeline.

Benefits:

| Benefit                   | Reason                     |
| ------------------------- | -------------------------- |
| Easier validation         | predictable schema         |
| Faster parser development | lower complexity           |
| Easier debugging          | human-readable format      |
| Reduced parser failures   | fewer format edge cases    |
| Consistent normalization  | unified ingestion boundary |

This also allowed more engineering focus on:

* multi-tenant isolation
* RBAC
* audit logging
* review workflows
* dashboard analytics
* ingestion architecture

instead of spending large amounts of time building:

* PDF parsers
* Excel ingestion pipelines
* SAP connectors
* OAuth integrations

In production systems, CSV is still commonly used because most enterprise platforms support CSV exports even if their native format is different.

The system therefore treats CSV as a normalized ingestion boundary.

---

# 3. Simplified Emission Factor Management

Emission calculations require mapping activities to emission factors.

Instead of implementing a fully versioned emission-factor management system, the project uses a simplified hybrid approach:

* lightweight in-memory mappings
* dictionary-based factor lookup
* database persistence for processed ESG records

Example:

```python
("Diesel", "L") → 2.68
("Electricity", "kWh") → 0.82
```

## Why

A production-grade factor-management system would require:

* regional factor variations
* historical factor tracking
* versioned factor tables
* admin management interfaces
* audit governance

This would significantly increase implementation complexity.

The simplified approach allowed:

* deterministic calculations
* easier validation
* faster development
* predictable dashboard aggregation

The architecture still remains extensible for future:

* DEFRA integration
* EPA datasets
* region-aware factors
* version-controlled factor tables

---

# 4. Simplified Realtime Dashboard Updates

The dashboard currently uses lightweight refresh-based updates instead of a fully deployed WebSocket infrastructure.

## Why

Realtime infrastructure introduces additional complexity:

* persistent socket connections
* worker coordination
* scaling concerns
* connection lifecycle management

Polling-based updates are simpler to deploy but create known tradeoffs:

| Problem             | Impact                             |
| ------------------- | ---------------------------------- |
| More requests       | increased bandwidth usage          |
| More server load    | additional CPU and memory pressure |
| Repeated DB queries | unnecessary database overhead      |

The architecture originally considered:

* WebSockets
* Server-Sent Events (SSE)

SSE was considered a better fit because dashboard updates are mostly one-way communication:

```text
Server → Client
```

Example:

* upload completed
* review finished
* dashboard metrics updated

However, due to deployment limitations and worker constraints, a simplified update strategy was selected for the prototype.

---

# 5. Object Storage Instead of Database Blob Storage

Uploaded CSV files are stored using object-storage URLs instead of storing binary files directly inside PostgreSQL.

## Why

Relational databases are not optimized for large binary file storage.

Direct blob storage inside SQL databases can increase:

* database size
* backup complexity
* storage cost
* query overhead

Object storage creates a more scalable architecture because:

| Advantage             | Reason                                  |
| --------------------- | --------------------------------------- |
| Stateless backend     | files separated from application server |
| Better throughput     | DB stores metadata only                 |
| Easier scaling        | storage isolated from compute           |
| Simpler file delivery | direct hosted file URLs                 |

This also loosely couples storage from ingestion processing.

The current prototype uses Cloudinary for deployment simplicity.

In production, AWS S3 or compatible object storage would likely be preferred for:

* scalability
* lifecycle policies
* regional replication
* enterprise storage governance

---

# Conclusion

The current implementation intentionally prioritizes:

* engineering clarity
* realistic ingestion workflows
* scalable architecture thinking
* deployment practicality
* assignment delivery constraints

Several production-grade features were intentionally simplified to keep the project achievable within the available timeline while still demonstrating:

* multi-tenant architecture
* ingestion pipelines
* async processing concepts
* auditability
* backend scalability thinking
