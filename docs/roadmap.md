# WashSetu Delivery Roadmap (6-8 Weeks)

## Week 1: Product Foundations
- Finalize PRD and acceptance criteria.
- Freeze user flows for customer, partner, and admin.
- Approve core screens and navigation map.
- Define API contracts and error code conventions.

## Week 2: Auth And Discovery
- Implement OTP auth flow and token middleware.
- Build vendor listing with location filters.
- Seed vendor and service data for QA.
- Add baseline logging and health endpoints.

## Week 3: Slot Engine Core
- Implement slot availability endpoint.
- Add slot lock strategy contract (Redis in prod design).
- Build booking creation transaction and conflict handling.
- Add unit tests for overbooking/concurrency guards.

## Week 4: Payments And Status Flow
- Integrate payment intent and webhook handling.
- Add order status transitions and booking event audit trail.
- Trigger booking confirmation and status notifications.
- Add idempotency protection for booking and webhook paths.

## Week 5: Partner And Admin Essentials
- Partner dashboard: slot capacity and order queue basics.
- Admin dashboard: vendor onboarding and incident view.
- Add review submission and moderation guardrails.
- Add reporting views for booking conversion and cancellations.

## Week 6: QA, Security, And Performance
- End-to-end test for complete booking lifecycle.
- Load test booking endpoint and slot conflict scenarios.
- Security pass: input validation, rate limiting, and auth checks.
- Observability: metrics, dashboards, and alert rules.

## Week 7-8: Beta Launch
- Pilot rollout with 10-20 laundry partners.
- Instrument funnel: install -> signup -> first booking -> repeat booking.
- Run weekly issue triage and UX improvements.
- Prepare launch playbook and support SOP.

## Test Strategy
- Unit tests: pricing, slot availability, status transition rules.
- Integration tests: booking transaction, payment webhook, review constraints.
- E2E tests: customer booking flow and partner status updates.
- Regression tests before every release candidate.

## Security Checklist
- OTP endpoint throttling and abuse detection.
- Signed webhook verification for payment providers.
- Sensitive data redaction in logs.
- Role-based access controls for partner/admin endpoints.

## Launch Readiness Gates
- Booking success rate above 97% in pilot.
- Slot conflict rate below 1%.
- Payment success rate above 95%.
- No critical/high open defects for launch scope.
