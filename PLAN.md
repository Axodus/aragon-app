# Sprint #2 Plan — Install Flows & UI Resilience

## Goals
- Deliver HarmonyVoting install and prepare flows with validation and safety checks.
- Improve UI resilience for RPC failures and offline scenarios.
- Ship tests and documentation to support release readiness.

## Non-Goals
- No contract changes or on-chain permission updates in this sprint.
- No new plugin types beyond HarmonyVoting install/prepare.

## Task Breakdown (Checklist)
- [ ] TASK-001: Install Flow — wizard UI, validator address validation, param encoding. (Issue #40)
- [ ] TASK-002: Prepare Flow — gas estimation, chain mismatch checks. (Issue #41)
- [ ] TASK-003: UI Resilience — retry UX, offline fallback, error messaging. (Issue #42)
- [ ] TASK-004: Integrations — builder registration, analytics, i18n. (Issue #43)
- [ ] TASK-005: Tests & Docs — unit/E2E smoke, update docs. (Issue #44)

## Implementation Steps & Guidelines
1. Scope UI flows and validation rules from existing HarmonyVoting install requirements.
2. Implement install wizard and parameter encoding with unit tests.
3. Implement pre-flight checks for gas and chain mismatch.
4. Add UI resilience and retry UX for RPC failures.
5. Integrate analytics, builders, and i18n keys.
6. Add tests, update documentation, validate acceptance criteria.

## Dependencies & Integration Points
- Aragon Governance UI Kit components
- wagmi/viem + AppKit wallet connection
- HarmonyVoting plugin install parameters
- Existing error handling and analytics utilities

## Acceptance Criteria
- Users can complete install flow with correct parameter encoding.
- Prepare flow blocks invalid installs and shows gas estimates.
- UI retries and error messages are clear for RPC failures.
- Analytics, builder registration, and i18n keys are complete.
- Unit coverage >= 90% on modified modules and E2E smoke passes locally.

## Rollout / Validation
- Validate flows locally with test wallet + mock RPC failure.
- Confirm E2E smoke passes before merging.

## References
- PR #39: Sprint #2 - Install Flows & UI Resilience
- PLAN_SPRINT_2.md: docs/plans/PLAN_SPRINT_2.md
