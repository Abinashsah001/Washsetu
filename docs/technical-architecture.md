# WashSetu Technical Architecture (MVP)

## Technology Decisions
- Mobile/Web client: React + TypeScript (current) with path to React Native/Flutter app later.
- API server: Node.js + Express.
- Primary database: PostgreSQL in production; SQLite for local development.
- ORM: Prisma.
- Cache/locking: Redis for slot checkout lock in production design.
- Queue: BullMQ (planned) for notification and webhook retries.
- Payments: Razorpay (India-first) with Stripe as future fallback.

## Service Boundaries
- `AuthService`: OTP issue/verify, session tokens, rate limits.
- `VendorService`: vendor profile, service catalog, slot capacities.
- `BookingService`: slot availability, lock, booking transaction.
- `PaymentService`: payment intent, webhook confirmation, reconciliation.
- `NotificationService`: push/SMS/WhatsApp dispatch with retries.

## Request Flow (Booking)
1. Client fetches available slots for selected vendor/date.
2. Client initiates checkout and receives temporary slot lock key.
3. Client submits payment confirmation.
4. Booking service validates lock and commits booking in DB transaction.
5. Event is emitted to queue; notification service sends confirmations.

## Concurrency And Slot-Locking Strategy
- Lock key format: `slot:{vendorId}:{slotId}`.
- Lock TTL: 120 seconds during checkout.
- On payment success:
  - Verify lock ownership token.
  - Open DB transaction.
  - Re-check `bookedCount < capacity`.
  - Insert booking + increment booked count atomically.
  - Release lock.
- If payment fails or TTL expires, release lock and keep slot available.

## Data Model (MVP)
- `users`: id, role, phone, email, displayName, createdAt.
- `vendors`: id, name, locationLat, locationLng, serviceRadiusKm, active.
- `services`: id, vendorId, serviceType, unitPrice, etaMinutes.
- `slots`: id, vendorId, date, startTime, endTime, capacity, bookedCount.
- `bookings`: id, userId, vendorId, slotId, paymentStatus, orderStatus, amount.
- `booking_events`: id, bookingId, status, actorRole, actorId, createdAt.
- `reviews`: id, bookingId, userId, vendorId, rating, comment.

## API Surface (MVP)
- `POST /auth/otp/request`
- `POST /auth/otp/verify`
- `GET /vendors`
- `GET /vendors/:vendorId/slots`
- `POST /bookings`
- `GET /bookings/:bookingId`
- `PATCH /bookings/:bookingId/status` (partner/admin)
- `POST /bookings/:bookingId/review`

## Security And Reliability Baseline
- Input validation on all API boundaries.
- OTP and booking endpoints protected with IP + identity rate limits.
- Idempotency key for booking creation and payment webhook processing.
- Structured logs with requestId and bookingId correlation.
- Health checks for API, DB, Redis, and queue worker.
