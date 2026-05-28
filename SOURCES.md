# SOURCES.md

# CarbonFlow Source Research Notes

This document explains the source systems, sample data assumptions, and real-world ingestion considerations used while building CarbonFlow.

The platform was designed as a prototype ESG ingestion system supporting:

* SAP fuel exports
* utility electricity datasets
* travel emissions datasets

The goal was not to perfectly replicate enterprise integrations, but to create realistic ingestion flows under limited implementation time.

---

# 1. SAP Source Research

## Real-World SAP Exports

Real SAP ESG-related exports are usually available through:

* IDoc exports
* OData APIs
* SAP BW reports
* flat CSV exports

Enterprise SAP systems often contain:

* inconsistent column naming
* plant-specific codes
* mixed units
* localized field names

Examples:

* `MENGE`
* `WERKS`
* `MEINS`

These field names are common in SAP fuel and logistics exports.

Because implementing full SAP connectivity was outside prototype scope, CSV exports were used as the ingestion format.

---

# SAP Sample Data Design

The sample SAP data intentionally included:

* inconsistent units
* negative quantities
* missing activity types
* invalid units

Example:

```csv id="cz4n5q"
plant_code,fuel_type,quantity,unit,transaction_date
PLANT_101,Diesel,-500,L,2026-05-01
PLANT_205,Natural Gas,1000,INVALID,2026-05-03
PLANT_310,,750,L,2026-05-04
```

The purpose was to simulate:

* bad enterprise exports
* incomplete operational records
* ingestion edge cases

A second valid dataset was also created:

```csv id="u0qv2k"
plant_code,fuel_type,quantity,unit,transaction_date
PLANT_101,Diesel,500,L,2026-05-01
PLANT_101,Petrol,200,L,2026-05-02
PLANT_205,Natural Gas,1000,m3,2026-05-03
PLANT_310,Diesel,750,L,2026-05-04
```

This was used to test:

* successful ingestion
* normalization
* dashboard aggregation
* review workflows

---

# SAP Real Deployment Risks

A real SAP deployment may fail due to:

* localized column names
* unexpected units
* missing plant mappings
* invalid encoding
* partial exports
* corrupted files

Example:

* parser may fail if `MENGE` is renamed
* units may vary across plants
* dates may use inconsistent formats

Future production systems would require:

* dynamic schema mapping
* configurable field aliases
* tenant-specific parser settings

---

# 2. Utility Source Research

## Real Utility Exports

Utility companies often provide:

* downloadable CSVs
* billing exports
* portal-generated spreadsheets

Real utility datasets commonly include:

* billing periods
* meter readings
* kWh usage
* supplier identifiers

Billing periods are usually not aligned perfectly to calendar months.

Example:

```text id="3i2uv8"
Dec 25 → Jan 25
```

instead of:

```text id="x79hsk"
Jan 1 → Jan 31
```

This becomes important for enterprise ESG reporting.

---

# Utility Sample Data Design

The utility sample focused on:

* electricity usage
* monthly billing representation
* simple kWh normalization

Example:

```csv id="vt9rqq"
kwh,bill_month
1200,2026-05-01
800,2026-05-02
```

The prototype intentionally simplified:

* supplier metadata
* meter identifiers
* tariff structures

This allowed focus on:

* ingestion
* normalization
* emissions calculation

instead of utility billing complexity.

---

# Utility Real Deployment Risks

Real utility ingestion may fail because:

* providers use PDF invoices
* billing periods overlap months
* units vary by region
* portals export inconsistent CSV structures

Additional real-world issues:

* estimated meter readings
* duplicated invoices
* timezone mismatches
* missing consumption periods

Future versions would require:

* PDF parsing
* OCR pipelines
* configurable utility schemas
* billing-period allocation logic

---

# 3. Travel Source Research

## Real Travel Exports

Corporate travel systems commonly export:

* CSV reports
* trip histories
* airport-pair datasets

Platforms such as:

* SAP Concur
* Navan
* Egencia

typically contain:

* airport codes
* booking references
* travel class
* trip dates

Travel exports are often incomplete.

Some exports contain:

* airport pairs only
* no actual distance values

---

# Travel Sample Data Design

The sample travel dataset was intentionally simplified.

Example:

```csv id="yrxj3u"
travel_type,distance_km,travel_date
Flight,1200,2026-05-01
Train,400,2026-05-02
```

The goal was to simulate:

* flight emissions
* train emissions
* travel-based ESG records

The parser also supports fallback airport distance mapping.

Example:

```text id="4f9n8w"
DEL → BOM
```

mapped internally to:

```text id="dcjlwm"
1150 km
```

This was added because some travel exports may not include explicit distances.

---

# Travel Real Deployment Risks

Real travel ingestion may fail because:

* airport codes may be missing
* unsupported airline systems may appear
* distances may be unavailable
* timezone handling may differ

Additional issues:

* cancelled flights
* duplicate bookings
* missing travel class
* regional airport aliases

Future systems would likely require:

* live flight APIs
* airport metadata services
* geospatial calculations
* booking reconciliation

---

# 4. Date Parsing Assumptions

Enterprise datasets rarely use one standard date format.

The platform supports:

* YYYY-MM-DD
* DD-MM-YYYY
* DD/MM/YYYY
* YYYY/MM/DD
* MM/DD/YYYY

This was necessary because:

* SAP exports vary
* utility portals differ
* travel exports are inconsistent

Instead of failing immediately:

* multiple formats are attempted
* invalid rows are flagged

This improves ingestion resilience.

---

# 5. Unit Normalization Assumptions

Enterprise systems export inconsistent units.

Examples:

* L
* l
* m3
* kWh
* MWh

The platform normalizes these into internal comparable formats.

Example:

```csv id="hzkjxf"
fuel_type,quantity,unit
Diesel,500,l
Natural Gas,1000,m3
Petrol,200,l
```

This normalization step was critical for:

* dashboard aggregation
* emissions calculations
* cross-source reporting

---

# 6. Prototype Constraints

The prototype intentionally focused on:

* ingestion workflows
* normalization
* review pipelines
* multi-tenancy
* auditability

instead of:

* enterprise SAP connectivity
* OCR pipelines
* production API integrations
* real-time synchronization

This tradeoff allowed implementation of:

* realistic ingestion architecture
* scalable review workflows
* source-specific parsing
* tenant-safe ESG analytics

within the available development timeline.

---

# Conclusion

The CarbonFlow ingestion system was designed using simplified but realistic enterprise assumptions.

The sample datasets intentionally included:

* inconsistent units
* invalid rows
* incomplete fields
* mixed date formats

to simulate real operational ESG ingestion challenges.

The current parser architecture remains extensible for:

* API-based ingestion
* configurable mappings
* OCR pipelines
* advanced validation
* enterprise-scale ESG processing.
