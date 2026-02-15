# Specification

## Summary
**Goal:** Deliver an MVP centralized growth management app for multi-brand D2C operations with secure Internet Identity login, role-based access, core modules (brands, KPIs, marketing, CRO, products, operations, tasks, reports, knowledge), and project documentation.

**Planned changes:**
- Add Internet Identity authentication and gate all pages behind a sign-in flow, including sign-out.
- Implement RBAC (Admin/Editor/Viewer) with backend-enforced write permissions and an Admin UI to assign roles to principals.
- Build a responsive app shell with desktop sidebar and mobile-friendly navigation, including routes for Brands, Dashboard, Marketing, CRO, Products, Operations, Tasks, Reports, Knowledge, and Settings with empty states.
- Implement Brand Management CRUD (create/view/edit/archive/delete) with key brand fields and weekly/monthly goals persisted in stable storage.
- Implement a Performance Dashboard with per-brand and cross-brand KPIs, weekly/monthly period selection, time-series charts, and missing-data guidance.
- Implement Marketing Manager for manual campaign logging, sortable comparison table, configurable underperformance highlighting, and creatives/copy storage as structured text + optional links.
- Implement Website & CRO module: optimization checklist, A/B test tracker (planned/running/completed), and searchable UX feedback notes per brand.
- Implement Product & Category Manager: SKU CRUD, top/low performer views from stored fields, and inventory alerts based on configurable thresholds.
- Implement Operations & Shipping: shipping partner/metrics logging, trends/summary per brand, and an ops issues log with status and filtering.
- Implement a non-LLM, rule-based Decision & Strategy Assistant that generates explainable recommendations and a savable weekly action plan linked to underlying data.
- Implement Reports: weekly/monthly report views with KPIs/charts and client-friendly layout, plus frontend PDF export including date range and brand scope.
- Implement Task & Workflow Manager: tasks with priority, due dates, in-app reminders/indicators, filters, notes, and optional brand association.
- Implement Knowledge repository: categorized entries, search, basic rich-text formatting, and link attachments with RBAC scoping.
- Apply a cohesive neutral analytics-style theme (not blue/purple) with reusable components for tables, metric cards, charts, navigation, and empty states.
- Add and commit documentation covering architecture, UI flow, Motoko data model/storage layout, and an MVP roadmap with deferred scope called out.

**User-visible outcome:** Users can securely sign in with Internet Identity, navigate a mobile-friendly multi-brand dashboard, manage brands and related operational/marketing/product/CRO data, view KPI dashboards and reports (exportable to PDF), track tasks and knowledge, and see rule-based recommendations—while Admins can manage user roles.
