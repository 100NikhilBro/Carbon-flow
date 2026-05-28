# MODEL.md

# CarbonFlow Data Model

CarbonFlow is designed as a multi-tenant ESG data ingestion and analytics platform.
The database schema focuses on tenant isolation, auditability, normalized emissions processing, and scalable ingestion workflows.

The platform stores uploaded ESG datasets from multiple enterprise sources such as SAP exports, utility bills, and travel datasets.
Every uploaded dataset is linked to a specific company tenant and processed into normalized ESG records.

---

# Core Design Goals

The data model was designed around five major goals:

1. Multi-tenant isolation
2. ESG data normalization
3. Auditability
4. Review workflow support
5. Scalable ingestion processing

---

# Database Schema Overview

| Table     | Purpose                            |
| --------- | ---------------------------------- |
| Company   | Represents tenant organizations    |
| User      | Handles authentication and RBAC    |
| UploadJob | Tracks uploaded ESG datasets       |
| ESGRecord | Stores normalized emission records |
| AuditLog  | Stores review and upload actions   |

---

# UUID-Based Identifiers

All major tables use UUID primary keys instead of incremental integer IDs.

UUIDs were chosen because:

* they are harder to guess in public APIs
* safer for multi-tenant systems
* reduce ID enumeration risks
* work better in distributed architectures

This prevents users from easily predicting records belonging to other organizations.

---

# Company Table

The `Company` table acts as the tenant boundary of the entire platform.

Every user, upload job, and ESG record belongs to a specific company.
This ensures complete tenant-level isolation between organizations.

Example:

* GreenVolt Energy users cannot access EcoTrans Logistics data
* EcoTrans dashboards only query EcoTrans records

## Important Fields

| Field      | Purpose                     |
| ---------- | --------------------------- |
| id         | UUID primary key            |
| name       | Human-readable company name |
| slug       | Unique tenant identifier    |
| industry   | ESG categorization          |
| country    | Reporting context           |
| created_at | Audit timestamp             |
| updated_at | Last modification timestamp |

The `slug` field is unique and allows stable tenant identification in APIs and frontend routing.

---

# User Table

The `User` table extends Django’s `AbstractUser` model and implements role-based access control.

Each user is linked to a single company using a foreign key relationship.

## Important Fields

| Field    | Purpose                   |
| -------- | ------------------------- |
| username | Login identifier          |
| role     | RBAC role                 |
| company  | Tenant ownership          |
| email    | User communication        |
| password | Authentication credential |

## RBAC Roles

| Role    | Permissions            |
| ------- | ---------------------- |
| Admin   | Full access            |
| Analyst | Upload + review access |
| Viewer  | Read-only access       |

The `company` foreign key is the foundation of tenant isolation.

Every authenticated request derives tenant scope from:

```python
request.user.company
```

This prevents cross-tenant data exposure.

---

# UploadJob Table

The `UploadJob` table tracks ingestion lifecycle events.

Every uploaded CSV file creates one upload job.

The upload job acts as:

* ingestion tracker
* processing state manager
* source-of-truth for uploaded datasets

## Important Fields

| Field              | Purpose                    |
| ------------------ | -------------------------- |
| company            | Tenant ownership           |
| source_type        | SAP / Utility / Travel     |
| original_file_name | Original uploaded filename |
| file               | Cloudinary file URL        |
| status             | Processing lifecycle       |
| uploaded_by        | Upload actor               |
| uploaded_at        | Upload timestamp           |
| processed_at       | Completion timestamp       |
| error_message      | Failure debugging          |

## Source Types

| Source  | Description                  |
| ------- | ---------------------------- |
| sap     | SAP fuel exports             |
| utility | Utility electricity datasets |
| travel  | Travel emissions datasets    |

The `status` field allows ingestion tracking across asynchronous workflows.

Possible states:

* pending
* processing
* completed
* failed

One upload job can generate multiple ESG records.

This relationship helps trace every emission row back to its original uploaded dataset.

---

# ESGRecord Table

`ESGRecord` is the central business table of the platform.

Each row represents one normalized emission activity.

The platform converts inconsistent uploaded source data into a standardized internal structure.

---

# Scope Tracking

The platform stores emission scopes using the `scope` field.

## Scope Types

| Scope   | Meaning               |
| ------- | --------------------- |
| scope_1 | Direct emissions      |
| scope_2 | Purchased electricity |
| scope_3 | Indirect emissions    |

This structure enables dashboard aggregation and emissions segmentation.

---

# Normalization Strategy

Uploaded source files often contain inconsistent units.

Examples:

* liters
* m3
* kWh
* gallons

To solve this, the system stores both:

* original quantity
* normalized quantity

## Important Fields

| Field               | Purpose                         |
| ------------------- | ------------------------------- |
| quantity            | Original uploaded value         |
| unit                | Original source unit            |
| normalized_quantity | Converted standardized quantity |
| normalized_unit     | Internal comparable unit        |
| co2e_emissions      | Final calculated emissions      |

Example:

```text
1000 liters diesel
→ normalized internally
→ kgCO2e emission value
```

This allows consistent dashboard aggregation across different source systems.

The `normalized_unit` field exists because different enterprise systems export incompatible measurement formats.

Without normalization:

* aggregation becomes inaccurate
* cross-source comparison becomes impossible
* dashboard analytics break

---

# Validation and Flagging

The platform validates uploaded ESG records during ingestion.

Invalid rows are flagged instead of deleted.

## Important Fields

| Field         | Purpose                          |
| ------------- | -------------------------------- |
| is_flagged    | Validation failure indicator     |
| flag_reason   | Human-readable validation reason |
| analyst_notes | Manual analyst comments          |

Example validation failures:

* negative quantity
* invalid date
* missing emission factor
* unsupported unit
* unknown plant code

Flagging preserves source traceability instead of silently dropping records.

---

# Review Workflow

Analysts can manually approve or reject records.

## Review Fields

| Field         | Purpose              |
| ------------- | -------------------- |
| review_status | Current review state |
| reviewed_by   | Reviewer username    |
| reviewed_at   | Review timestamp     |

Possible statuses:

* pending
* approved
* rejected

This creates a controlled ESG review pipeline before final reporting.

---

# AuditLog Table

The `AuditLog` table stores immutable review activity history.

Every important action generates an audit event.

## Tracked Actions

| Action   |
| -------- |
| uploaded |
| approved |
| rejected |

## Important Fields

| Field       | Purpose              |
| ----------- | -------------------- |
| username    | Action performer     |
| action      | Event type           |
| entity_type | Target model         |
| entity_id   | Target object        |
| changes     | JSON change snapshot |
| created_at  | Audit timestamp      |

The `changes` JSON field stores contextual metadata about actions.

Example:

```json
{
  "file_name": "sap_may_2026.csv",
  "source_type": "sap"
}
```

Audit logging was implemented for:

* compliance traceability
* review accountability
* debugging
* historical reconstruction

---

# Relationships

| Relationship           | Type        |
| ---------------------- | ----------- |
| Company → Users        | One-to-Many |
| Company → UploadJobs   | One-to-Many |
| Company → ESGRecords   | One-to-Many |
| UploadJob → ESGRecords | One-to-Many |

This structure keeps ingestion history linked to generated records.

---

# Multi-Tenant Isolation

Tenant isolation is enforced at the database and application layer.

Every ESG query is filtered using:

```python
request.user.company
```

Example:

```python
ESGRecord.objects.filter(
    company=request.user.company
)
```

This ensures:

* tenant-safe dashboards
* isolated uploads
* isolated review workflows
* isolated analytics

Cross-company access is never exposed through frontend filters alone.

Tenant security is enforced server-side.

---

# Record Locking Strategy

The system currently uses status-based logical locking.

Approved records are treated as finalized records in the review workflow.

Rejected and approved states prevent accidental review ambiguity.

Future production versions can extend this using:

* optimistic locking
* row versioning
* distributed transaction control

---

# Timestamp Strategy

Most tables include:

* created_at
* updated_at

These timestamps provide:

* audit visibility
* debugging capability
* ingestion tracking
* reporting chronology

They also act as source-of-truth indicators for uploaded enterprise datasets.

---

# Conclusion

The CarbonFlow schema was designed to support:

* enterprise ESG ingestion
* normalized emissions processing
* secure multi-tenant isolation
* scalable review workflows
* audit-compliant activity tracking

The current structure is optimized for prototype scalability while remaining extensible for future production deployments.
