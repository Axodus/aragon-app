#  #EPIC-002 - HarmonyVoting Frontend UI & UX Production Release

**Repository:** aragon-app (Axodus/aragon-app)  
**End Date Goal:** 2026-02-28  
**Priority:** HIGH  
**Estimative Hours:** 120h  
**Status:** in progress

---

## Executive Summary

Deliver production-ready HarmonyVoting frontend with resilient UI/UX, graceful degradation, plugin uninstall flows, native-token semantics.

**Vision:** Enable users to safely manage HarmonyVoting plugins — setup, propose, vote, execute, uninstall without confusion or errors.

**Timeline:** 6-week sprint (2026-01-21 → 2026-02-28)

---

## Subtasks (Linked)

### EPIC-002: HarmonyVoting Frontend E2E Production Release
[labels:type:epic, area:frontend] [status:IN_PROGRESS] [priority:HIGH] [estimate:120h] [start:2026-01-13] [end:2026-02-28]

**Phase 1 (2026-01-13 → 2026-01-21) — Setup & Forms:**
- [x] Plugin setup form with validator address (20h, DONE) [labels:type:feature, area:frontend] [status:DONE] [priority:HIGH] [estimate:20h]

**Phase 2 (2026-01-20 → 2026-02-04) — Install & Prepare:**
- [x] Implement setup form (4h, DONE) [labels:type:task, area:frontend] [status:DONE] [priority:HIGH] [estimate:4h]
- [ ] Verify prepare installation (6h, IN_PROGRESS) [labels:type:task, area:frontend] [status:IN_PROGRESS] [priority:HIGH] [estimate:6h]
- [ ] Display prepare errors (4h) [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h]

**Phase 3 (2026-01-22 → 2026-02-11) — UI Resilience:**
- [ ] Render proposals without metadata (4h) [labels:type:feature, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h]
- [ ] Handle backend unavailability (6h) [labels:type:feature, area:frontend] [status:TODO] [priority:HIGH] [estimate:6h]
- [ ] Metadata fallback fetching (5h) [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:5h]

**Phase 4 (2026-02-05 → 2026-02-18) — Uninstall & Native-Token:**
- [ ] Uninstall confirmation dialog (6h) [labels:type:feature, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:6h]
- [ ] Post-uninstall state (4h) [labels:type:task, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h]
- [ ] Native-token value/fee display (6h) [labels:type:feature, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:6h]

**Phase 5 (2026-02-19 → 2026-02-28) — E2E Testing & Release:**
- [ ] E2E flow tests (8h) [labels:type:test, area:frontend] [status:TODO] [priority:HIGH] [estimate:8h]
- [ ] Cross-browser testing (4h) [labels:type:qa, area:frontend] [status:TODO] [priority:HIGH] [estimate:4h]
- [ ] Accessibility audit (4h) [labels:type:qa, area:frontend] [status:TODO] [priority:MEDIUM] [estimate:4h]

---

## Progress Update (2026-01-28)

- Completed:
	- `Plugin setup form with validator address` — DONE
	- `Implement setup form` — DONE
	- `Break-glass feature: FEATURE-004` was created in `aragon-app/docs/plans/FEATURE_break-glass_plugin_disable.md`

- In progress:
	- `Verify prepare installation` — IN_PROGRESS

Notes: I recorded the active todo list for this epic in the workspace task tracker (plugin setup and initial form implementation marked completed). See `docs/plans/FEATURE_break-glass_plugin_disable.md` for the new break-glass feature details.


## Acceptance Criteria

- [x] Plugin setup form with validator address (DONE)
- [ ] Install/prepare flows with error handling
- [ ] Metadata fallback prevents broken cards
- [ ] UI gracefully handles backend unavailability
- [ ] Plugin uninstall flow with warnings
- [ ] Native-token fee/value display
- [ ] E2E tests passing
- [ ] WCAG 2.1 AA accessibility

---

**Version:** 2.0  
**Last Updated:** 2026-01-22  
**Template:** [EPIC.md](https://gist.github.com/mzfshark/2ab8856d6c0efc0dfa9d1f98d2a23fdf)

---

## Deliverables

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
