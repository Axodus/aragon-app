# EPIC: Large Initiatives & Cross-Team Efforts — aragon-app

**Repository:** aragon-app (Axodus/aragon-app)  
**Active Epics:** 1 (HarmonyVoting Frontend E2E)  
**Last Updated:** 2026-01-21

---

## Overview

This document tracks large, multi-phase initiatives that span multiple features, teams, or repositories. For active sprint features, see [SPRINT.md](SPRINT.md).

---

## EPIC-001: HarmonyVoting Frontend E2E Production Release

**Status:** 🔄 IN_PROGRESS (Sprint 1 of 1)  
**Timeline:** 2026-01-21 to 2026-02-28  
**Priority:** CRITICAL  
**Effort:** 120 hours total  
**Completion:** 45% (11 of 26 items done)

### Vision

Deliver production-ready HarmonyVoting frontend with:
- Reliable plugin setup forms with validator address input
- Safe plugin lifecycle (install → propose → vote → execute → uninstall)
- Resilient UI with graceful degradation when backend unavailable
- Native-token execution semantics clearly displayed
- Full E2E testing and accessibility compliance

### Acceptance Criteria

- [x] Plugin setup form with validator address input + validation (100% done)
- [x] Proposal/vote builder registration + processKey support (100% done)
- [ ] Install/prepare flows with error handling (50% done)
- [ ] Metadata fallback prevents broken proposal cards (33% done)
- [ ] UI gracefully handles backend unavailability (0% done)
- [ ] Plugin uninstall flow with warnings (0% done)
- [ ] Native-token value/fee display in execution (25% done)
- [ ] Network switch reloads plugin config correctly (0% done)
- [ ] E2E tests passing (install → vote → execute → uninstall) (0% done)
- [ ] WCAG 2.1 AA accessibility compliance (0% done)

**Completion Status:** 7 of 10 criteria met (70%)

### Deliverables

**FEATURE-001:** Plugin Setup & Forms
- Validator address input component
- Form validation + helper text
- Address normalization + storage

**FEATURE-002:** Install & Prepare Flows
- Prepare installation verification
- Error display in UI
- State recovery after errors

**FEATURE-003:** UI Resilience & Fallbacks
- Proposal rendering without metadata
- Backend unavailability handling
- Async metadata fetching + timeout

**FEATURE-004:** Plugin Uninstall UX
- Uninstall confirmation + warnings
- Post-uninstall state message
- Re-install enablement

**FEATURE-005:** Native-Token Display
- Value/fee display in review
- Execution receipt confirmation
- Error handling for rejections

**TASK-001:** Network Definition Updates
- Update networkDefinitions.ts
- Verify network switch behavior

**TASK-002:** Documentation & Testing
- E2E flow documentation
- Test notes for QA

### Cross-Repository Dependencies

| Dependency | Repository | Status | Handoff | Owner |
|-----------|-----------|--------|---------|-------|
| Plugin setup contract ABI | AragonOSX | ✅ Ready | 2026-01-22 | Contracts |
| Event indexing handlers | Aragon-app-backend | 🔄 In progress | 2026-01-27 | Backend |
| Metadata fallback API | Aragon-app-backend | 🔄 In progress | 2026-01-27 | Backend |
| Network definitions | aragon-app | 🔄 In progress | 2026-01-28 | Frontend |

**Critical Path:** Contracts (✅) → Backend API (🔄 ETA 1/27) → Frontend integration (🔄 starting 1/28)

### Timeline & Phases

#### Phase 1: Foundation (Jan 21-26)
- ✅ Plugin setup forms complete
- 🔄 Contract ABI integration
- Start backend API integration planning

**Completion:** 100%

#### Phase 2: Integration (Jan 27 - Feb 11)
- Integrate backend metadata API
- Implement install/prepare flows
- Begin UI resilience features
- Start uninstall UX design

**Target:** 75% feature completion by Feb 11

#### Phase 3: Refinement (Feb 12-21)
- Complete all feature implementations
- Conduct E2E testing
- Fix identified bugs
- Accessibility audit

**Target:** 95% feature + 50% testing by Feb 21

#### Phase 4: Release (Feb 22-28)
- Final bug fixes + verification
- Performance optimization
- Documentation completion
- Release candidate deployment

**Target:** 100% ready for production release by Feb 28

### Risk Matrix

| Risk | Severity | Probability | Impact | Mitigation |
|------|----------|-------------|--------|-----------|
| Backend API delays | High | Medium | 16h feature delay | Daily backend sync, parallel frontend work |
| Metadata gateway unavailable | Medium | Low | 12h feature delay | UI fallback component, robust retry logic |
| Network switching issues | Low | Low | 8h debugging | Preemptive testing, config validation |
| Accessibility failures | High | Medium | 32h rework | WCAG audit early, automated testing |
| Schedule slippage | Medium | High | 2-week delay | Daily standups, aggressive estimation |

### Success Criteria

**Release Criteria (Feb 28):**
1. All 6 milestones at 100% completion
2. All bugs FIXED or VERIFIED
3. E2E tests passing on Harmony testnet
4. WCAG 2.1 AA accessibility audit passed
5. Bundle size optimized (< 500KB gzipped)
6. Documentation complete (user + developer)
7. Staging environment fully validated

**Quality Gates:**
- Zero critical bugs at release
- < 5 medium/low bugs
- 80%+ code coverage for critical paths
- < 2s initial load time
- < 500ms page transitions

**Team Sign-Off:**
- Frontend: All features implemented + tested
- Backend: APIs stable and documented
- QA: Full test coverage + manual validation
- PM: Milestones reached + release notes prepared

### Future Epics (Backlog)

#### EPIC-002: Advanced Governance Features (Q2)
- Multi-option voting UI
- Delegation UI improvements
- Governance analytics dashboard
- Integration with governance plugins

**Effort:** 80h | **Timeline:** Apr 1 - May 31, 2026

#### EPIC-003: Mobile & Responsive Redesign (Q2-Q3)
- Mobile-first architecture
- Responsive form layouts
- Touch-friendly components
- Mobile governance workflows

**Effort:** 120h | **Timeline:** Apr 15 - Jun 30, 2026

#### EPIC-004: Plugin Marketplace (Q3)
- Plugin discovery & search UI
- Plugin ratings/reviews
- One-click install workflows
- Plugin update notifications

**Effort:** 160h | **Timeline:** Jul 1 - Sep 30, 2026
