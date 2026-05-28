# DECISIONS.md

# CarbonFlow Engineering Decisions

This document explains the major engineering and architectural decisions made during the development of CarbonFlow.

The assignment intentionally contained several ambiguities around:

* ingestion formats
* ESG normalization
* source integration
* validation handling
* review workflows

The following decisions were made to keep the platform realistic, scalable, and achievable within the prototype timeline.

---

# 1. CSV Uploads Instead of Direct SAP APIs

The platform uses CSV uploads instead of direct SAP integrations.

## Why This Decision Was Made

Real SAP integrations commonly use:

* IDoc exports
* OData APIs
* SAP Gateway services
* enterprise authentication layers

Implementing full SAP connectivity would require:

* SAP credentials
* enterprise network access
* OAuth or SAP authentication
* complex schema mapping
* pagination handling

This was not realistic for a prototype timeline.

CSV exports were chosen because:

* SAP systems already support CSV exports
* easier reproducibility
* simpler testing
* realistic MVP ingestion flow
* easier debugging

The ingestion architecture was still designed in a way that future API-based ingestion can be added later.

---

# 2. Source-Specific Parsers Instead of One Generic Parser

Separate parsers were created for:

* SAP
* Utility
* Travel

## Why Generic Parsing Was Avoided

Each source system exports data differently.

Examples:

* SAP uses fields like `MENGE`, `WERKS`, `MEINS`
* utility datasets contain billing periods and meter readings
* travel datasets contain airport codes and travel modes

A single generic parser would become:

* difficult to maintain
* full of conditional logic
* harder to validate
* error-prone for enterprise formats

Instead, source-specific parsers were implemented.

This improved:

* readability
* validation accuracy
* source-specific transformations
* future scalability

Each parser owns:

* field aliases
* validation assumptions
* fallback logic
* normalization preparation

This also allows new ingestion sources to be added independently.

---

# 3. CSV Over PDF Utility Parsing

Utility ingestion was implemented using CSV uploads instead of PDF bills.

## Why PDF Parsing Was Avoided

PDF extraction is unreliable because:

* layouts vary by utility provider
* OCR introduces parsing errors
* tables may shift across pages
* scanned PDFs require OCR pipelines

CSV files were chosen because:

* utilities often support downloadable CSV exports
* easier validation
* deterministic parsing
* easier unit normalization

This allowed the prototype to focus on:

* ESG workflows
* normalization
* review pipelines

instead of OCR complexity.

---

# 4. Travel CSVs Instead of Live Travel APIs

Travel data ingestion was implemented using CSV exports instead of direct travel APIs.

## Why APIs Were Avoided

Real travel systems such as:

* Navan
* SAP Concur
* corporate travel APIs

typically require:

* OAuth authentication
* enterprise approval
* pagination handling
* rate limits
* API quotas

Implementing production-grade travel integrations would exceed the prototype scope.

CSV exports were selected because:

* travel platforms support CSV exports
* ingestion becomes deterministic
* easier for testing
* easier for reviewers to reproduce

The parser architecture remains extensible for future API integration.

---

# 5. Celery + Redis Instead of Threading

The ingestion pipeline was originally designed using:

* Celery
* Redis

instead of Python threading.

## Why Celery Was Chosen

Threading inside web servers is unreliable for:

* long-running ingestion jobs
* retries
* distributed scaling
* job monitoring

Celery provides:

* queue management
* async processing
* retry support
* worker separation
* scalable ingestion workflows

This was important because ESG uploads may contain:

* large CSVs
* thousands of rows
* normalization logic
* validation steps
* emission calculations

The production architecture supports fully asynchronous ingestion.

Due to free-tier deployment limitations, synchronous execution was temporarily used for deployment compatibility.

---

# 6. Cloudinary Instead of AWS S3

Uploaded files are stored in Cloudinary.

## Why Cloudinary Was Chosen

AWS S3 is more production-oriented but requires:

* IAM setup
* bucket policies
* additional configuration
* more deployment overhead

Cloudinary was chosen because:

* faster setup
* simpler deployment
* reliable hosted file URLs
* sufficient for MVP scale

The storage layer can later be replaced with S3-compatible object storage.

---

# 7. Hardcoded Emission Factors

Emission factors were implemented as application-level mappings.

Example:

```python
("Diesel", "L") → 2.68
("Electricity", "kWh") → 0.82
```

## Why This Decision Was Made

A full production system would use:

* versioned emission databases
* region-specific factors
* historical factor tracking
* DEFRA datasets
* EPA datasets

For the prototype:

* deterministic calculations
* explainability
* simplicity

were prioritized.

The architecture remains extensible for database-driven emission factors later.

---

# 8. Unit Normalization Strategy

Enterprise datasets often contain inconsistent units.

Examples:

* liters
* gallons
* MWh
* kWh
* miles
* km

The platform standardizes units using:

* `normalized_quantity`
* `normalized_unit`

## Why This Was Important

Without normalization:

* dashboard aggregation becomes inaccurate
* emission calculations become inconsistent
* cross-source reporting breaks

The normalization utility was separated from parser logic to improve:

* maintainability
* reusability
* future extensibility

---

# 9. Validation Strategy

Invalid records are flagged instead of deleted.

## Why This Decision Was Made

Enterprise ESG systems require:

* traceability
* review visibility
* auditability

Deleting invalid rows would:

* hide ingestion issues
* reduce transparency
* make debugging difficult

Instead:

* records remain stored
* validation failures are flagged
* analysts can manually review them

Examples:

* invalid date formats
* missing activity type
* unsupported units
* unknown plant codes
* missing emission factors

This creates a safer review workflow.

---

# 10. Multiple Date Format Support

Enterprise datasets rarely use one standard date format.

The platform supports:

* YYYY-MM-DD
* DD-MM-YYYY
* DD/MM/YYYY
* YYYY/MM/DD
* MM/DD/YYYY

## Why This Was Added

Uploaded files from different enterprise systems may vary significantly.

Instead of rejecting all non-standard formats:

* multiple formats are attempted
* invalid formats are flagged

This improves ingestion flexibility while preserving validation visibility.

---

# 11. Airport Distance Fallback Logic

The travel parser supports fallback distance calculation using airport codes.

Example:

```text
DEL → BOM
```

maps to:

```text
1150 km
```

## Why This Was Implemented

Travel exports sometimes contain:

* airport pairs
* but not distance values

The fallback improves:

* ingestion completeness
* user experience
* partial dataset recovery

instead of rejecting records immediately.

---

# 12. Review Workflow Design

Uploaded ESG records are not automatically trusted.

Every record enters:

```text
pending
```

review status.

Analysts can:

* approve
* reject
* add notes

## Why Manual Review Was Added

Enterprise ESG reporting often requires:

* analyst oversight
* compliance checks
* anomaly validation

Automatic approval could:

* allow incorrect emissions
* bypass compliance review
* reduce auditability

Manual review provides operational control before reporting.

---

# 13. PM Questions That Would Need Clarification

Several product decisions would require clarification from a Product Manager in a real deployment.

Examples:

* How should cross-month utility billing periods be handled?
* Should emission factors vary by country?
* Can analysts edit approved records?
* How should duplicate uploads be detected?
* Should uploads automatically retry on parser failure?
* Are tenant admins allowed to override flagged records?
* How should historical factor versioning work?
* Should rejected records remain reportable?

These ambiguities were simplified for the prototype implementation.

---

# Conclusion

The CarbonFlow architecture prioritizes:

* tenant isolation
* deterministic ingestion
* auditability
* normalization
* scalable processing
* maintainable parser design

The current implementation intentionally favors:

* engineering clarity
* reproducibility
* explainability

while remaining extensible for future enterprise-scale deployment.
