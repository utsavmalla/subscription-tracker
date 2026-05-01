# Subscription Tracker Figma Draft Plan

## Goal

This document prepares a Figma-ready draft UI structure for the Subscription Tracker web app. It is intended to be used as the source plan for creating frames in Figma once the Figma MCP connection is available.

## Recommended first Figma file structure

### Pages
- Cover
- Foundations
- Components
- Screens
- Mobile

## Foundations

### Color roles
- Primary: deep teal
- Primary surface: soft teal tint
- Background: warm off-white
- Card background: ivory white
- Border: sand gray
- Text primary: charcoal blue-gray
- Text secondary: muted slate
- Success: green
- Warning: amber
- Due today: orange
- Danger: red
- Expired: muted cocoa/slate

### Typography direction
- Headings: elegant serif for dashboard personality
- UI text: clean sans-serif for readability

Suggested pairing:
- Headings: `Merriweather` or `Lora`
- Body/UI: `Inter`, `Manrope`, or `Work Sans`

### Spacing scale
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

### Radius scale
- Small: 10
- Medium: 16
- Large: 24
- Pill: 999

### Shadow style
- Soft card shadow
- Medium panel shadow

## Component list

### Navigation
- Sidebar item
- Active sidebar item
- Top action bar

### Data and status
- Summary metric card
- Status badge
- Table row
- Table header
- Empty state card
- Alert item row
- Recent activity row

### Inputs and controls
- Primary button
- Secondary button
- Search field
- Filter chip
- Select field
- Date field
- Text input
- Text area
- Checkbox

### Overlays
- Confirm delete modal
- Import validation panel
- Toast notification

## Screen plan

### 1. Dashboard desktop

Frame name:
- `Dashboard / Desktop`

Frame size:
- 1440 x 1600

Sections:
- Sidebar navigation
- Top header with title and actions
- Hero summary banner
- Metric cards row
- Upcoming renewals panel
- Overdue items panel
- Quick filter strip
- Subscription table preview
- Recent updates panel

### 2. Dashboard mobile

Frame name:
- `Dashboard / Mobile`

Frame size:
- 390 x 1400

Sections:
- Mobile top bar
- Title and add button
- Stacked metric cards
- Upcoming renewals list
- Overdue list
- Monthly spend card
- Subscription cards list

### 3. Subscriptions list desktop

Frame name:
- `Subscriptions / Desktop`

Frame size:
- 1440 x 1400

Sections:
- Page header
- Search and action row
- Filter toolbar
- Full subscriptions table
- Right-side optional detail preview drawer

### 4. Add subscription form desktop

Frame name:
- `Add Subscription / Desktop`

Frame size:
- 1440 x 1300

Sections:
- Header with back link
- Basic details card
- Payment and dates card
- Status preview card
- Notes card
- Sticky footer actions

### 5. Import / export desktop

Frame name:
- `Import Export / Desktop`

Frame size:
- 1440 x 1100

Sections:
- Intro header
- CSV upload card
- Mapping preview table
- Validation issues panel
- Export card

### 6. Alerts desktop

Frame name:
- `Alerts / Desktop`

Frame size:
- 1440 x 1200

Sections:
- Header
- Status tabs
- Attention list
- Quick actions

## Dashboard content draft

### Sidebar
- Logo: `SubTrack`
- Nav items:
  - Dashboard
  - Subscriptions
  - Add Subscription
  - Import / Export
  - Alerts
  - Settings

### Top header
- Title: `Subscription Dashboard`
- Supporting text: `Track renewals, overdue items, and monthly spend in one place.`
- Actions:
  - `Import CSV`
  - `+ Add Subscription`

### Hero banner
- Heading: `What needs your attention right now?`
- Body copy about upcoming, overdue, and spend visibility
- Right-side stat cards:
  - Monthly recurring spend
  - Items needing review this week

### Metric cards
- Total Subscriptions
- Active
- Upcoming
- Overdue
- Expired

### Upcoming renewals list
Example items:
- Netflix
- Adobe Creative Cloud
- Spotify

Fields:
- Service name
- Renewal date
- Renewal cycle
- Amount
- Status badge

### Overdue list
Example items:
- Canva Pro
- Domain Renewal

Fields:
- Service name
- Due date
- Amount
- Overdue state
- Quick resolution action

### Table preview
Columns:
- Service
- Amount
- Cycle
- Next Renewal
- Status
- Remarks

### Recent updates
- Payment updated
- CSV imported
- Reminder marked done

## Form behavior notes

### Add/edit subscription form logic
- If cycle is `OneTime`, emphasize `Expiration Date`
- If cycle is recurring, emphasize `Next Renewal Date`
- Status is shown as computed preview, not primary editable field
- Remarks can display helper badge patterns such as `Auto Renewal Cancel`

### Validation visuals
- Field-level error text
- Required field marker
- Disabled save state
- Success toast after save

## Figma build order

1. Create foundations page with color, text, spacing, and radius tokens
2. Create component page with reusable cards, badges, buttons, fields, and rows
3. Build `Dashboard / Desktop`
4. Build `Dashboard / Mobile`
5. Build `Subscriptions / Desktop`
6. Build `Add Subscription / Desktop`
7. Build `Import Export / Desktop`
8. Build `Alerts / Desktop`

## What I would create in Figma first

If we want the fastest useful draft, I recommend starting with only these three frames:
- `Dashboard / Desktop`
- `Dashboard / Mobile`
- `Add Subscription / Desktop`

These three screens establish the visual language, the data density rules, and the main product workflow.

## Current blocker

The Figma skill is installed locally, but the active Codex session does not currently expose the connected Figma MCP tools needed to create or modify the Figma file directly from here.

Once the Figma connection is active, this document can be used immediately to generate the first draft in Figma.
