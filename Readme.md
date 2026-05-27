# CarbonFlow
Multi-tenant ESG data ingestion and analyst review platform.

## Live Demo
| Service | Link |
|---|---|
| Frontend | https://carbon-flow-liard.vercel.app |
| Backend API | https://carbon-flow-kyb4.onrender.com/api/health/ |

## Demo Videos
| Demo | Link |
|---|---|
| Full Walkthrough | https://youtu.be/8Z_uB9ub8AA |
| Multi-Tenancy Demo | https://drive.google.com/file/d/1q-u4pm2xhyB7b-z0YaKHZmBCPTKW88aO/view |
| Audit Logging | https://drive.google.com/file/d/1z4A0j4ZCWChEzhpAlf_-OyUWrHyZxbNn/view |

## Architecture
<!-- Add architecture diagram here -->

## Tech Stack
Django · DRF · PostgreSQL · Celery · Redis · React · TypeScript · Tailwind · Cloudinary · Vercel · Render

## Key Features
- JWT auth + RBAC (Admin / Analyst / Viewer)
- Multi-tenant data isolation per company
- SAP, Utility, Travel CSV ingestion with separate parsers
- Async processing via Celery + Redis
- ESG validation, flagging, CO2e calculation
- Analyst approve/reject workflow with record locking
- Audit trail on every action
- Real-time WebSocket notifications
- CSV/Excel export

## Async Note
Free-tier deployment runs ingestion synchronously.
Full Celery async architecture is implemented — restore `process_upload_job.delay(...)` for production.

## Docs
- [MODEL.md](./MODEL.md)
- [DECISIONS.md](./DECISIONS.md)
- [SOURCES.md](./SOURCES.md)
- [TRADEOFFS.md](./TRADEOFFS.md)
