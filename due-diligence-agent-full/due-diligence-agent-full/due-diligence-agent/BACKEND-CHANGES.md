# Backend additions (to support the frontend spec)

Everything the frontend (`Frontend_Flow.pdf`) calls for now has a matching
backend endpoint. This file documents what was added/changed and why, plus
a couple of things worth knowing about the choices made.

**A note on verification**: the sandbox this was built in has no access to
Maven Central (only a small egress allow-list) and no JDK, so the full
Spring Boot application itself was never compiled. Every new class was
written carefully against the existing codebase's actual patterns/types
(verified by reading the real entities/DTOs/repositories, not guessed).
The two standalone utility classes with no Spring dependencies
(`SimplePdfWriter`, `SimpleXlsxWriter`) *were* compiled and tested in
isolation with a JDK installed for this purpose — see their section below.
Please run `./gradlew build` before trusting this in production.

## 1. Property pagination & filters (`PropertyController`, spec 4.3)

- Added `bedrooms` / `bathrooms` (`Integer`, nullable) to `Property`. With
  `hibernate.ddl-auto=update` these columns are added automatically on
  next startup — no manual migration needed.
- `PropertyRepository` now extends `JpaSpecificationExecutor<Property>`.
- New `PropertySpecifications.withFilters(propertyType, minBedrooms, minBathrooms)`
  builds the optional filter predicate.
- `GET /api/properties` now takes a `Pageable` (`page`, `size`, `sort`) plus
  the three filter params and returns a real `Page<Property>` (Spring's
  standard `{content, totalElements, totalPages, number, size, ...}` JSON
  shape — this is exactly what the frontend's `Page<T>` type already
  expected).

## 2. Comparables, market trends, value history (`PropertyAnalyticsService`, spec 4.4)

No external comps/listings provider is integrated anywhere in this
codebase, so rather than fabricate data, these are derived from what's
already in the database:

- **Comparables** (`GET /api/properties/{id}/comparables`): other
  properties in the same city/state, ranked by real great-circle
  (Haversine) distance using each property's `latitude`/`longitude`, with
  the most recent `OwnershipRecord.saleDate` (if any) shown as sold date.
- **Market trends** (`GET /api/properties/{id}/comparables/trends`):
  median of `TaxHistory.marketValue` (falling back to `assessedValue`) per
  tax year, aggregated across every property in the same city/state.
- **Value history** (`GET /api/properties/{id}/value-history`): the
  property's own `TaxHistory` records, chronologically.

This means these three features only return meaningful data once your
seed data actually has multiple properties per city/state with tax
history and lat/lng populated — with sparse data they'll correctly return
an empty list rather than an error.

## 3. Notifications (spec 4.7)

- New `Notification` entity/repository/service, new `NotificationController`
  (`GET /api/notifications?user=`).
- Hooked into `ReportService.generateReport()`: a notification is created
  for the requesting user when their report reaches `COMPLETED` or
  `FAILED`.
- There's no "mark as read" endpoint, since the frontend doesn't call one
  — every notification is unread until you add that.

## 4. Profile (`UserController`, `UserService`, spec 4.8)

- `GET/PUT /api/users/profile`, `POST /api/users/change-password`.
- **Changing your email invalidates your current session.** This backend's
  JWT subject *is* the user's email (`JwtService.generateToken(user.getEmail())`),
  and there's no token-refresh flow. If you change your email via the
  profile page, your existing token no longer resolves to a user on the
  next request — you'll need to log in again with the new email. This is
  a real limitation of the existing auth design, not a bug in the new
  endpoint; flagging it so it doesn't look like a regression later.

## 5. Admin: summary + audit log (`AdminController`, `AuditLogService`, spec 4.9)

- New `AuditLog` entity/repository/specifications/service.
- Hooked into `AuthService` (`LOGIN`, `REGISTER`), `PropertyController`
  (`SEARCH`, on both browse and address search), `ReportService`
  (`REPORT_REQUEST`), and `UserService` (`PROFILE_UPDATE`, `PASSWORD_CHANGE`).
- `GET /api/admin/dashboard/summary` — `totalUsers` and
  `totalReportsGenerated` are real counts. **`totalPropertiesSearched` is a
  count of `SEARCH` audit log actions performed**, not a count of distinct
  properties — `Property` has no search-count column, so this is the
  closest honest proxy available without adding one.
- `GET /api/admin/audit-logs?user=&actionType=&from=&to=` — filtered via
  `AuditLogSpecifications`.
- **`SecurityConfig` now restricts `/api/admin/**` to `hasRole("ADMINISTRATOR")`.**
  This wasn't previously enforced anywhere in `SecurityConfig` (no role
  checks existed at all before this change) — the frontend spec assumed
  it already was, so this was necessary, not optional.

## 6. Report PDF / Excel download (`ReportDocumentService`, spec 4.5)

No PDF or spreadsheet library (iText, PDFBox, Apache POI, etc.) could be
added as a dependency in the sandbox this was built in — Maven Central
wasn't reachable. Rather than leave these two buttons non-functional,
two small, dependency-free writers were built using only `java.io` /
`java.util.zip`:

- **`util/SimplePdfWriter`**: hand-rolled PDF 1.4 writer producing a real,
  valid, multi-page document (standard Helvetica font, no embedding
  needed). **This was actually compiled and tested** — a generated PDF
  was verified byte-for-byte (every xref offset checked to point at the
  exact right object) and successfully parsed with `pypdf`, correctly
  extracting text across pages. Escaping of `(`, `)`, `\` is tested and
  correct. Non-ASCII characters are replaced with `?` (this simple
  implementation doesn't embed a font with a wider character set).
- **`util/SimpleXlsxWriter`**: hand-rolled OOXML SpreadsheetML writer
  (inline strings, no `sharedStrings.xml` needed). **Also compiled and
  tested** — a generated file was opened with `openpyxl` and read back
  byte-correct data, including proper XML-escaping of `&`, `<`, `>`, `"`.
  Numbers are written as text cells (left-aligned in Excel) rather than
  numeric cells, for simplicity.
- `ReportDocumentService` builds the actual report content (executive
  summary, risk breakdown, timeline) and hands it to these writers.
  `ReportController` exposes `GET /api/reports/{id}/pdf` and `/excel`.

If Apache POI / PDFBox are reachable in your real build environment,
swapping these out is straightforward — `ReportDocumentService` is the
only caller, and it only needs `byte[]` back.

## 7. Login now returns the user's role (already delivered, restated here)

`AuthResponse` gained `id`/`fullName`/`email`/`role`, populated in
`AuthService.login()` — needed because the JWT only encodes email and
there was previously no other way for the frontend to know a logged-in
user's role for the role-based dashboards / admin-page protection the
spec calls for.

## Still true from before

- Report generation remains synchronous (`POST /api/properties/{id}/reports`
  returns a `COMPLETED`/`FAILED` report in one call). The frontend still
  polls defensively for an async version with no frontend changes needed.
- Registration still always creates a `BUYER` (`AuthService.register()`
  hardcodes this, `RegisterRequest` has no role field). To see the other
  four role dashboards, promote a user's role directly in the database.
