# FEATURE: New Functionality & Enhancements — aragon-app

**Repository:** aragon-app (Axodus/aragon-app)  
**Active Features in Sprint 1:** 5 (Setup Forms, Install Flows, UI Resilience, Uninstall UX, Native-Token Display)  
**Last Updated:** 2026-01-21

---

## Overview

This document tracks new features and enhancements for the Aragon App frontend. For active sprint items, see [SPRINT.md](SPRINT.md).

---

## Active Features (Sprint 1)

See [SPRINT.md](SPRINT.md) for detailed tracking of:

1. **FEATURE-001:** Plugin Setup & Forms (100% complete)
2. **FEATURE-002:** Install & Prepare Flows (50% complete)
3. **FEATURE-003:** UI Resilience & Fallbacks (33% complete)
4. **FEATURE-004:** Plugin Uninstall UX (0% complete)
5. **FEATURE-005:** Native-Token Execution Display (25% complete)

---

## Backlog: Future Features (Q2 & Beyond)

### UI Performance Optimization

- [ ] FEATURE-201: Implement proposal list virtualization [labels:type:feature, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:24h] [start:2026-03-01] [end:TBD]
  **Description:** Virtualize long proposal lists to improve render performance with 1000+ proposals.

### Mobile & Responsive Design

- [ ] FEATURE-202: Mobile-first responsive redesign [labels:type:feature, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:40h] [start:2026-04-01] [end:TBD]
  **Description:** Improve mobile UX for proposal creation, voting, and execution flows.

### Accessibility Enhancements

- [ ] FEATURE-203: WCAG 2.1 AA compliance audit [labels:type:feature, area:frontend] [status:BACKLOG] [priority:HIGH] [estimate:32h] [start:2026-05-01] [end:TBD]
  **Description:** Full accessibility audit and remediation (keyboard navigation, screen reader support, color contrast).

### Advanced Governance Features

- [ ] FEATURE-204: Multi-option voting UI [labels:type:feature, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:16h] [start:2026-06-01] [end:TBD]
  **Description:** Support for voting plugins with more than 2 options (ranked choice, etc).

---

## Feature Priority Matrix

| Feature | Impact | Effort | Priority | Status |
|---------|--------|--------|----------|--------|
| Setup Forms | High | Low | CRITICAL | ✅ DONE |
| Install Flows | High | Medium | HIGH | 🔄 IN_PROGRESS |
| UI Resilience | High | Medium | HIGH | 🔄 IN_PROGRESS |
| Uninstall UX | Medium | Medium | HIGH | ⏳ TODO |
| Native-Token Display | Medium | Low | MEDIUM | 🔄 IN_PROGRESS |
| UI Perf (Virtualization) | Medium | High | MEDIUM | ⏳ BACKLOG |
| Mobile Responsive | High | High | MEDIUM | ⏳ BACKLOG |
| Accessibility | High | Medium | HIGH | ⏳ BACKLOG |

---

## Dependencies & Cross-Repository Integration

### Contract Changes (AragonOSX)
- HarmonyVoting plugin setup contract (✅ ready)
- Address normalization requirements (✅ documented)

### Backend API Changes (Aragon-app-backend)
- Metadata fallback endpoint (🔄 in progress)
- Event indexing handlers (🔄 in progress)
- Error response format standardization (🔄 in progress)

### Network Configuration
- Harmony plugin addresses need updating (pending contracts deployment)
- RPC endpoint validation (✅ done)

---

## Feature Release Timeline

### Sprint 1 (Jan 21 - Feb 28, 2026)
- ✅ Plugin Setup & Forms (Complete)
- 🔄 Install Flows (In Progress, target: Feb 4)
- 🔄 UI Resilience & Fallbacks (In Progress, target: Feb 11)
- ⏳ Plugin Uninstall UX (Pending, target: Feb 18)
- 🔄 Native-Token Display (In Progress, target: Feb 16)

### Q2 (Mar 1 - May 31, 2026)
- UI Performance (Virtualization, pagination)
- Mobile-first redesign
- Advanced governance features
- Plugin marketplace discovery

### Q3 (Jun 1 - Aug 31, 2026)
- Multi-option voting UI
- Enhanced governance analytics
- Integration with plugins ecosystem
