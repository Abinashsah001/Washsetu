# WashSetu MVP Product Requirements

## Product Goal
Enable customers to reliably book laundry pickup/drop slots while giving vendors a clear capacity-managed order pipeline.

## In Scope (MVP)
- OTP-based sign-in (`phone` primary, `email` optional).
- Location-based nearby vendor discovery.
- Slot booking with capacity checks.
- Checkout with online payment or COD toggle.
- Order tracking from booking to delivery.
- Booking reminders and status notifications.
- Post-completion rating and review.

## Out Of Scope (MVP)
- Subscription memberships.
- Dynamic surge pricing.
- Loyalty/referral wallet.
- WhatsApp conversational booking.

## User Roles

### Customer
- Discover vendors by location and service type.
- Compare pricing, ETA, and ratings.
- Book pickup/drop slots and pay securely.
- Track live order status and receive alerts.
- Rate completed orders.

### Laundry Partner
- Configure service catalog and pricing.
- Publish and manage daily slot capacities.
- Accept orders and update status.
- View booking queue and fulfillment timeline.

### Admin
- Onboard and verify vendors.
- Monitor booking funnel and failures.
- Handle disputes, refunds, and promotions.
- Review operational metrics and SLA breaches.

## MVP Functional Requirements

## 1) Authentication
- Users can sign in with OTP.
- Session tokens are issued after successful verification.
- Rate limit OTP requests and verification attempts.

## 2) Vendor Discovery
- Show vendors within configurable radius.
- Filters: distance, price range, service type, rating.
- Default sort: nearest + highest reliability score.

## 3) Slot Booking Engine
- Slot availability is derived from vendor capacity.
- Slot is soft-locked for a short checkout window.
- Booking commit succeeds only if capacity is available.
- Double booking is prevented with lock + transaction.

## 4) Checkout And Payments
- Show final itemized amount before payment.
- Payment methods: UPI, card, wallet, COD (vendor toggle).
- Booking status reflects payment status.

## 5) Order Tracking
- Status flow: `Booked -> PickedUp -> Washing -> Ready -> Delivered`.
- Timestamped event log for each transition.
- Push notification on every state change.

## 6) Reviews
- One review per completed booking.
- Rating scale: 1 to 5.
- Optional text feedback.

## Non-Functional Requirements
- Booking API p95 latency below 400ms at MVP scale.
- 99.5% monthly booking service availability.
- Full audit trail for status and payment updates.

## Customer Journey
1. User signs in with OTP.
2. User discovers nearby vendor.
3. User selects service + date + time slot.
4. User confirms address and pays.
5. User receives booking confirmation.
6. User tracks order progression.
7. User submits rating after delivery.

## Partner Journey
1. Vendor signs in to dashboard.
2. Vendor sets slots and daily capacity.
3. Vendor receives bookings in queue.
4. Vendor updates fulfillment status.
5. Vendor reviews ratings and completion stats.

## Admin Journey
1. Admin approves vendor profile.
2. Admin tracks booking and cancellation trends.
3. Admin resolves exceptions (refund/dispute).
4. Admin optimizes campaigns based on funnel data.

## MVP Acceptance Criteria
- Customer can complete booking in under 6 steps.
- Slot conflicts are prevented in concurrent booking attempts.
- Vendor can update status and users see changes in near real time.
- Admin can view operational metrics and booking incidents.
