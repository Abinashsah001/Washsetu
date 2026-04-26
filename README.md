# WashSetu

WashSetu is a smart laundry slot booking system focused on fast booking, reliable order tracking, and vendor capacity management.

## Quick Start

### Frontend
- Install dependencies: `npm install`
- Run locally: `npm run dev`

### Backend
- Move to backend folder: `cd server`
- Install dependencies: `npm install`
- Generate Prisma client: `npm run prisma:generate`
- Push schema to local DB: `npm run prisma:push`
- Start API: `npm run dev`

## Project Deliverables
- Brand foundation: `docs/brand.md`
- MVP PRD and user journeys: `docs/prd-mvp.md`
- Technical architecture and slot-locking strategy: `docs/technical-architecture.md`
- API contract (OpenAPI): `docs/api-spec.yaml`
- Wireframe blueprint: `docs/wireframes.md`
- Build roadmap: `docs/roadmap.md`

## Existing Demo Flow
The current React app demonstrates an end-to-end booking flow:
- slot selection
- clothes selection
- payment
- OTP verification
- booking confirmation

The backend currently persists bookings through `server/index.js` and Prisma.
