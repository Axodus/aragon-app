#  #FEATURE-002 - Install Flows & UI Resilience

Repository: Axodus/aragon-app
End Date Goal: 2026-02-18
Priority: High
Estimative Hours: 80h
Status: in progress

Executive Summary

Sprint #2 will implement the Install & Prepare flows for the HarmonyVoting plugin and improve UI resilience. Goals: complete install flow UX, ensure safe behavior on RPC failures, add client-side fallbacks, and provide tests and documentation for release readiness.

Subtasks (Linked)

- [ ] TASK-001: Install Flow - Add install wizard and parameter validation [status:todo] [estimate:20h] [start:2026-01-24] [end:2026-02-02]
  - Acceptance criteria: user can complete install with validator address, validation errors shown, encoded installation params match contract expectations.

- [ ] TASK-002: Prepare Flow - Pre-flight checks and gas estimations [status:todo] [estimate:12h] [start:2026-02-03] [end:2026-02-06]
  - Acceptance criteria: show gas estimate, detect wallet chain mismatch, block unsuitable installs.

- [ ] TASK-003: UI Resilience - Retry UI, offline fallback, error surfaces [status:todo] [estimate:18h] [start:2026-02-03] [end:2026-02-10]
  - Acceptance criteria: graceful retry for RPC failures, user-visible retry button, meaningful error messages.

- [x] TASK-004: Integrations - Builder registration, analytics hooks, i18n keys [status:done] [estimate:10h] [start:2026-02-08] [end:2026-02-12]
  - Acceptance criteria: builders registered, analytics events emitted, strings added to locale files.

- [ ] TASK-005: Tests & Docs - Unit tests, E2E smoke, update `PLAN.md` and `VALIDATION.md` [status:todo] [estimate:20h] [start:2026-02-10] [end:2026-02-18]
  - Acceptance criteria: unit tests >= 90% on modified modules, E2E smoke passes locally, docs updated.

Milestones

- Milestone 1: Install Flow MVP complete (TASK-001) — target 2026-02-02
- Milestone 2: UI Resilience + Prepare Flow — target 2026-02-10
- Milestone 3: Tests, Docs, Release Prep — target 2026-02-18

Notes

- Public-facing content must be in English for repo artifacts (PR bodies, commit messages).
- Create a branch `feature/sprint2/install-flows` from `develop` (frontend branch currently on `develop`).

---
