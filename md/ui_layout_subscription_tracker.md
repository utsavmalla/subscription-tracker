# Subscription Tracker Web App UI Layout

## Purpose

This document translates the MVP product spec into a practical UI layout plan for the web app. It is intended to guide page structure, component design, responsive behavior, and user flow before implementation starts.

The UI should feel:
- Simple and spreadsheet-friendly
- Fast to scan
- Focused on renewals and alerts
- Easy to use for both manual entry and imported subscription data

## Design direction

### Product tone
- Clear, calm, and utility-first
- Dashboard-led experience
- Emphasis on attention states: Upcoming, Due Today, Overdue, Expired
- Lightweight enough for personal use, but structured enough for 100+ records

### Suggested visual language
- Clean card-based dashboard
- Strong use of status color chips and bordered alert panels
- Spacious table layout for desktop
- Compact stacked cards for mobile
- Soft neutral background with one strong accent color for actions

### Suggested color roles
- Primary action: deep teal or royal blue
- Active: green
- Upcoming: amber
- Due Today: orange
- Overdue: red
- Expired: slate or muted gray-red
- Completed/Done: cool gray with check accent

These are semantic roles, not fixed brand colors. Exact palette can be finalized during implementation.

## Global app structure

### App shell

The app should use a dashboard-style shell with:
- Left sidebar on desktop
- Top compact header on mobile
- Main content area with page title, quick actions, and content modules

### Primary navigation
- Dashboard
- Subscriptions
- Add Subscription
- Import / Export
- Alerts
- Settings

### Persistent header actions
- Global search
- Add subscription button
- Import CSV button
- User/system area placeholder for future auth

## Information architecture

### 1. Dashboard page

The dashboard is the home screen and should answer:
- What needs attention right now?
- What renewals are coming soon?
- What is overdue or expired?
- What am I spending monthly?

#### Desktop layout

Top row:
- Page title: `Subscription Dashboard`
- Secondary text: current date and quick summary
- Right-aligned actions:
  - `+ Add Subscription`
  - `Import CSV`

Second row: summary cards in a 5-column or 4-column responsive grid
- Total Subscriptions
- Active
- Upcoming
- Overdue
- Expired

Third row: split layout
- Left large panel: Upcoming Renewals
- Right medium panel: Overdue Items

Fourth row: split layout
- Left: Monthly Spend Estimate
- Right: Recent Updates / Recently Added

Bottom section:
- Quick filter bar
- Compact subscriptions table preview

#### Mobile layout
- Header with title and add button
- Horizontal scroll or 2-column stacked summary cards
- Upcoming renewals list first
- Overdue list second
- Monthly spend card third
- Table replaced by stacked subscription cards with quick actions

#### Recommended dashboard widgets

##### Summary cards
Each card should include:
- Metric label
- Large number
- Optional small helper text
- Small icon or colored edge

Examples:
- `Upcoming: 6`
- `Overdue: 2`

##### Upcoming renewals panel
Each row should show:
- Service name
- Renewal date
- Amount
- Renewal cycle
- Status badge
- Quick action: `Mark Done` or `View`

##### Overdue items panel
Each row should show:
- Service name
- Missed renewal date
- Amount
- Days overdue
- Quick action: `Update Payment`

##### Monthly spend estimate
Can be shown as:
- Large total number
- Small breakdown by recurring vs one-time
- Optional mini bar visualization later

##### Recent updates
Show:
- Service name
- What changed
- Updated time

## Subscriptions list page

This page is the main management screen for all records.

### Page goals
- Find subscriptions quickly
- Filter by status/cycle/done state
- Sort by dates or amount
- Perform quick actions without opening every record

### Desktop layout

Top area:
- Page title: `All Subscriptions`
- Search bar
- Buttons:
  - `Add Subscription`
  - `Export CSV`

Below header: filter toolbar
- Search by service name
- Status filter
- Renewal cycle filter
- Done filter
- Date range filter
- Clear filters action

Main content:
- Full-width data table

### Table columns
- Service Name
- USD
- Amount
- Date Paid
- Renewal Cycle
- Next Renewal Date
- Expiration Date
- Status
- Done
- Remarks
- Actions

### Row actions
- View
- Edit
- Mark Done
- Delete

### Interaction notes
- Clicking row opens detail drawer or detail page
- Status should be color-coded
- Long remarks truncate with tooltip or expand on click
- Sorting available on date and amount columns

### Mobile layout
- Replace large table with card list
- Each card shows:
  - Service name
  - Amount
  - Next renewal or expiration date
  - Status badge
  - Done state
  - Overflow menu for actions

## Subscription detail page

This page gives a complete read-only overview before editing.

### Recommended sections
- Header with service name, current status, and actions
- Payment and renewal details
- Notes and remarks
- Alert history placeholder
- Meta info such as created/updated dates

### Header actions
- Edit
- Mark Done
- Delete
- Back to list

### Content blocks

#### Basic info card
- Service name
- Renewal cycle
- Current status
- Done state

#### Billing card
- USD amount
- Local amount
- Date paid
- Next renewal date
- Expiration date

#### Remarks card
- Full notes text
- Highlight remarks like `Auto Renewal Cancel` as a small badge

## Create and edit subscription form

The create and edit experiences should share one form layout.

### Form goals
- Minimize confusion between recurring and one-time subscriptions
- Validate required fields clearly
- Keep spreadsheet field names recognizable

### Form layout

#### Section 1: Basic details
- Service Name
- Renewal Cycle
- USD amount
- Local Amount
- Currency Code

#### Section 2: Payment and dates
- Date Paid
- Next Renewal Date
- Expiration Date

#### Section 3: Status helpers
- Done checkbox
- Computed status preview
- Alert state preview

#### Section 4: Notes
- Remarks textarea

#### Footer actions
- Save Subscription
- Save and Add Another
- Cancel

### Conditional behavior
- If `Renewal Cycle = OneTime`, emphasize `Expiration Date`
- If recurring cycle is selected, emphasize `Next Renewal Date`
- Show inline helper text for what each date means
- Status field should be display-only in MVP if backend computes it

### Validation behavior
- Required field labels should be obvious
- Show errors directly below fields
- Date errors should explain what is missing and why
- Amount fields should reject negative values

## Import / export page

This page should support spreadsheet migration and data portability.

### Layout
- Page title and short helper text
- Two main cards side by side on desktop, stacked on mobile

#### Card 1: Import CSV
- Drag-and-drop zone
- File picker button
- Mapping preview table
- Validation issues list
- Import button

#### Card 2: Export data
- Export current filtered data
- Export all subscriptions
- Download CSV button

### Import UX recommendations
- Show expected column names
- Preview first few parsed rows
- Highlight unmatched fields
- Show errors without blocking valid rows where possible

## Alerts page

This page can be a focused operational view of reminders.

### Purpose
- Show attention-needed items in one place
- Help users complete follow-up actions quickly

### Layout
- Tabs or segmented controls:
  - Upcoming
  - Due Today
  - Overdue
  - Expired
  - Completed

### Alert item structure
- Service name
- Alert reason
- Relevant date
- Amount
- Quick action:
  - Mark Done
  - Edit
  - View subscription

## Settings page

For MVP, keep this lightweight.

### Suggested sections
- Default currency display
- Reminder window setting placeholder, such as `7 days before`
- Data management
- Future email reminder toggle placeholder

## Component system

### Core reusable components
- App sidebar
- Mobile top bar
- Summary metric card
- Status badge
- Alert list item
- Filter chip/select
- Search input
- Data table
- Empty state panel
- Form field wrapper
- Confirmation modal
- CSV import dropzone

### Status badge behavior
- `Active`: green-toned
- `Upcoming`: amber-toned
- `DueToday`: orange-toned
- `Overdue`: red-toned
- `Expired`: muted dark tone
- `Completed`: neutral gray with subtle success icon

## Responsive layout guidance

### Desktop
- Sidebar visible
- Dashboard cards in 4 to 5 columns
- Tables prioritized
- Multi-column forms

### Tablet
- Sidebar can collapse
- Dashboard widgets move into 2-column grid
- Forms reduce to fewer columns

### Mobile
- Sticky top action bar
- No dense tables by default
- Replace tables with cards
- Filters collapse into bottom sheet, modal, or accordion
- Primary actions remain thumb-accessible

## Empty, loading, and error states

### Empty states
- No subscriptions yet: show onboarding card with `Add Subscription` and `Import CSV`
- No overdue items: show positive empty state
- No search results: suggest clearing filters

### Loading states
- Skeleton cards on dashboard
- Table row skeletons
- Disabled save button with spinner during form submit

### Error states
- CSV parsing error banner
- Form submission error toast
- API/network retry prompt

## UX priorities for MVP

### Highest priority interactions
1. See overdue and upcoming subscriptions instantly
2. Add or edit a subscription quickly
3. Search and filter a growing list of subscriptions
4. Mark an alert as done without friction
5. Import spreadsheet data with confidence

### Nice UI behaviors for MVP
- Sticky filter bar on list page
- Inline status chips
- Quick actions on hover for desktop
- Confirm delete modal
- Toast after create, update, import, and export

## Suggested page hierarchy

1. Dashboard
2. Subscriptions list
3. Subscription detail
4. Create/edit form
5. Import/export
6. Alerts
7. Settings

## Suggested MVP-first layout decision

If implementation time is limited, prioritize these views in order:
1. Dashboard
2. Subscriptions list
3. Create/edit form
4. Import/export
5. Subscription detail
6. Alerts

This sequencing matches the core user journey from visibility to management.

## Visual draft reference

A lightweight HTML dashboard draft has been created alongside this document to make the direction easier to review visually before coding the actual frontend.

Recommended companion file:
- `design/subscription-tracker-wireframe.html`

## Final note

This layout intentionally favors practical clarity over decorative complexity. The core UI should help users answer one question very quickly: which subscriptions need my attention right now, and what do I do next?
