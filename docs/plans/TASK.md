# TASK: Repository Maintenance & Technical Debt — aragon-app

**Repository:** aragon-app (Axodus/aragon-app)  
**Active Tasks in Sprint 1:** 2 (Network Defs, Documentation)  
**Last Updated:** 2026-01-21

---

## Overview

This document tracks maintenance tasks, refactoring, tech debt, and non-feature work. For active sprint items, see [SPRINT.md](SPRINT.md).

---

## Active Tasks (Sprint 1)

See [SPRINT.md](SPRINT.md) for detailed tracking of:

1. **TASK-001:** Network Definition Updates (0% complete, 8h remaining)
2. **TASK-002:** Documentation & Testing Notes (0% complete, 4h remaining)

---

## Backlog: Future Tasks (Q2 & Beyond)

### Code Quality & Refactoring

- [ ] TASK-101: Extract metadata fetching hook [labels:type:refactor, area:frontend] [status:BACKLOG] [priority:HIGH] [estimate:8h] [start:2026-02-01] [end:TBD]
  **Description:** Extract common metadata fetching logic into reusable custom hook with timeout/retry.

- [ ] TASK-102: Refactor proposal card component [labels:type:refactor, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:12h] [start:2026-02-15] [end:TBD]
  **Description:** Split ProposalCard into smaller, testable sub-components.

- [ ] TASK-103: Add TypeScript strict mode [labels:type:refactor, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:16h] [start:2026-03-01] [end:TBD]
  **Description:** Enable TypeScript strict mode and fix all type errors.

### Testing & Quality Assurance

- [ ] TASK-201: Unit tests for setup forms [labels:type:test, area:frontend, area:testing] [status:BACKLOG] [priority:HIGH] [estimate:12h] [start:2026-02-05] [end:TBD]
  **Description:** Write unit tests for all plugin setup form components.

- [ ] TASK-202: E2E tests with Playwright [labels:type:test, area:frontend, area:testing] [status:BACKLOG] [priority:HIGH] [estimate:20h] [start:2026-02-12] [end:TBD]
  **Description:** Write E2E tests for critical user flows (install → propose → vote → execute).

- [ ] TASK-203: Visual regression testing [labels:type:test, area:frontend, area:testing] [status:BACKLOG] [priority:MEDIUM] [estimate:16h] [start:2026-02-20] [end:TBD]
  **Description:** Set up visual regression tests with Percy or similar.

### Performance & Optimization

- [ ] TASK-301: Bundle size analysis & optimization [labels:type:optimization, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:8h] [start:2026-03-15] [end:TBD]
  **Description:** Analyze bundle size and identify optimization opportunities.

- [ ] TASK-302: Implement lazy loading for modules [labels:type:optimization, area:frontend] [status:BACKLOG] [priority:MEDIUM] [estimate:12h] [start:2026-03-20] [end:TBD]
  **Description:** Implement route-based code splitting for faster initial load.

### Documentation & DevEx

- [ ] TASK-401: Document plugin setup process [labels:type:docs, area:docs] [status:BACKLOG] [priority:MEDIUM] [estimate:4h] [start:2026-02-25] [end:TBD]
  **Description:** Document how to implement a new plugin setup form.

- [ ] TASK-402: Create developer onboarding guide [labels:type:docs, area:docs] [status:BACKLOG] [priority:MEDIUM] [estimate:8h] [start:2026-03-01] [end:TBD]
  **Description:** Comprehensive guide for new developers setting up dev environment.

---

## Tech Debt Summary

### High Priority (16h)
- [ ] Address case normalization across all inputs (2h) — ✅ DONE
- [ ] Error boundary coverage (2h)
- [ ] API error handling standardization (4h)
- [ ] Metadata fetch refactoring (8h)

### Medium Priority (20h)
- [ ] Proposal card refactoring (12h)
- [ ] TypeScript strict mode (8h)

### Low Priority (16h)
- [ ] Bundle size optimization (8h)
- [ ] Lazy loading implementation (8h)

**Total Tech Debt:** 52 hours of backlog work

---

## Quarterly Planning

### Q1 (Jan - Mar 2026)
- ✅ Plugin Setup Forms
- 🔄 Install/Prepare Flows
- 🔄 UI Resilience & Fallbacks
- 🔄 Plugin Uninstall UX
- 🔄 Native-Token Display
- ⏳ Unit tests for forms
- ⏳ E2E tests (critical flows)

### Q2 (Apr - Jun 2026)
- UI Performance (virtualization, lazy loading)
- Mobile-first responsive redesign
- Visual regression testing
- Documentation improvements
- Accessibility audit (WCAG 2.1 AA)

### Q3 (Jul - Sep 2026)
- Advanced governance features
- Multi-option voting UI
- Community feedback integration
- Plugin marketplace integration
- Performance optimization phase 2

---

## Task Categories

### Development Tasks
- Feature implementation tasks
- Integration tasks
- Cross-repo coordination tasks

### Maintenance Tasks
- Dependencies updates
- Security patches
- CI/CD improvements

### Quality Tasks
- Testing implementation
- Performance optimization
- Accessibility improvements
- Documentation

### Learning Tasks
- Dev onboarding
- Architecture documentation
- Best practices guides
