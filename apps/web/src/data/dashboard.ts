export const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Subscriptions", href: "/subscriptions" },
  { label: "Add Subscription", href: "/subscriptions/new" },
  { label: "Import / Export", href: "/import" },
  { label: "Alerts", href: "/alerts" },
  { label: "Settings", href: "/settings" },
];

export const metrics = [
  {
    label: "Total",
    value: "42",
    helper: "Across all tracked services",
    tone: "border-slate-200 bg-white",
  },
  {
    label: "Active",
    value: "31",
    helper: "Currently renewing",
    tone: "border-emerald-200 bg-emerald-50",
  },
  {
    label: "Upcoming",
    value: "6",
    helper: "Due in the next 7 days",
    tone: "border-amber-200 bg-amber-50",
  },
  {
    label: "Overdue",
    value: "2",
    helper: "Need payment review",
    tone: "border-rose-200 bg-rose-50",
  },
  {
    label: "Expired",
    value: "3",
    helper: "One-time plans ended",
    tone: "border-stone-300 bg-stone-100",
  },
];

export const upcomingRenewals = [
  {
    service: "Netflix",
    date: "May 04",
    amount: "$15.49",
    cycle: "Monthly",
    status: "Upcoming",
  },
  {
    service: "Adobe Creative Cloud",
    date: "May 06",
    amount: "$54.99",
    cycle: "Monthly",
    status: "Upcoming",
  },
  {
    service: "Spotify",
    date: "May 08",
    amount: "$10.99",
    cycle: "Monthly",
    status: "Upcoming",
  },
];

export const overdueItems = [
  {
    service: "Canva Pro",
    date: "Apr 28",
    amount: "$12.99",
    days: "3 days",
  },
  {
    service: "Domain Renewal",
    date: "Apr 25",
    amount: "$18.00",
    days: "6 days",
  },
];

export const recentUpdates = [
  {
    service: "Notion",
    detail: "Payment updated",
    time: "Today",
  },
  {
    service: "Figma",
    detail: "CSV import added record",
    time: "Yesterday",
  },
  {
    service: "GitHub",
    detail: "Reminder marked done",
    time: "Apr 29",
  },
];

export const previewRows = [
  {
    service: "Netflix",
    amount: "$15.49",
    cycle: "Monthly",
    next: "May 04, 2026",
    status: "Upcoming",
    remarks: "Family streaming plan",
  },
  {
    service: "Canva Pro",
    amount: "$12.99",
    cycle: "Monthly",
    next: "Apr 28, 2026",
    status: "Overdue",
    remarks: "Team design workspace",
  },
  {
    service: "Domain Renewal",
    amount: "$18.00",
    cycle: "Yearly",
    next: "Apr 25, 2026",
    status: "Overdue",
    remarks: "Auto Renewal Cancel",
  },
  {
    service: "Notion",
    amount: "$8.00",
    cycle: "Monthly",
    next: "May 17, 2026",
    status: "Active",
    remarks: "Workspace plan",
  },
];
