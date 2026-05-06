# BUG: Issue Tracking & Resolution — aragon-app

**Repository:** aragon-app (Axodus/aragon-app)  
**Last Updated:** 2026-01-21  
**Status:** 3 bugs (1 FIXED, 1 IN_PROGRESS, 1 INVESTIGATING)

---

## Critical Issues (Production Impact)

---

## BUG-001: Validator Address Normalization (FIXED ✅)

**Area:** frontend  
**Priority:** MEDIUM  
**Status:** FIXED → VERIFIED  
**Reported:** 2026-01-16  
**Affected:** Delegation setup form
**Fixed:** 2026-01-17  
**Verified:** 2026-01-18

### Description

Validator address input not normalized to lowercase on form load, causing case-sensitive comparison mismatches.

**Severity:** Medium  
**Impact:** Setup form accepts UPPERCASE addresses; backend compares against lowercase addresses, causing auth failures.

### Steps to Reproduce

1. Load Delegation plugin setup form
2. Pre-fill validator address in UPPERCASE (0xABCD...)
3. Submit setup transaction
4. Compare stored value against on-chain registered address (lowercase)
5. Expected: All lowercase; Actual: Case mismatch error

### Root Cause Analysis

**Root Cause:** Address input not passed through `address.toLowerCase()` on mount/change  
**Fix Applied:** Added normalization in form state + input handlers  
**Impact:** All addresses now normalized consistently

### Fix Implementation

**Commit:** `xyz9999def` (2026-01-17)  
**Changes:**
- Added `input.value = input.value.toLowerCase()` on address input change
- Normalized validator address on form mount
- Updated all address comparisons to use lowercase

**Verification Steps:**
- [x] Form testing with UPPERCASE input verified [labels:type:qa] [status:DONE] [priority:MEDIUM] [estimate:1h]
- [x] Backend API comparison successful [labels:type:qa] [status:DONE] [priority:MEDIUM] [estimate:1h]
- [x] No address case mismatches in logs [labels:type:qa] [status:DONE] [priority:MEDIUM] [estimate:1h]

**SLA:** MEDIUM (8-24h) — ✅ RESOLVED in 2h

---

## BUG-002: Metadata Fetch Blocks Proposal Card Rendering

**Area:** frontend, indexing  
**Priority:** HIGH  
**Status:** IN_PROGRESS  
**Reported:** 2026-01-20  
**Affected:** Proposal card, metadata loader

### Description

Proposal cards do not render until metadata fetch completes, blocking entire view.

**Severity:** High  
**Impact:** Proposals with unavailable metadata become un-renderable; governance flow blocked.

### Steps to Reproduce

1. Create proposal with IPFS-hosted metadata
2. Simulate IPFS gateway timeout (5s+)
3. Observe: UI shows error state instead of placeholder metadata
4. Expected: UI shows "Metadata unavailable" but keeps core info (title, votes, buttons)
5. Actual: Proposal card renders blank or error

### Root Cause

**Hypotheses (under investigation):**
- Metadata fetch promise blocking render until resolved
- No fallback UI component for unavailable metadata
- Backend timeout not respected (fetches indefinitely)

**Related Code:**
- `src/modules/governance/ProposalCard.tsx` — rendering
- `src/hooks/useProposalMetadata.ts` — metadata fetching

### Solution (Proposed)

**Render Proposal Without Metadata:**
1. Split metadata fetching from card rendering
2. Show card with core data immediately (no metadata)
3. Fetch metadata asynchronously in background
4. Update card when metadata arrives (if available)
5. Show "Metadata unavailable" if fetch times out after 5s

**Implementation:**
- [ ] Extract metadata fetching to separate async hook [labels:type:refactor] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-01-22] [end:2026-01-23]
- [ ] Render proposal card without waiting for metadata [labels:type:feature] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-01-24] [end:2026-01-24]
- [ ] Add timeout to metadata fetch (5s) [labels:type:feature] [status:TODO] [priority:HIGH] [estimate:2h] [start:2026-01-25] [end:2026-01-25]
- [ ] Implement fallback UI component (placeholder) [labels:type:feature] [status:TODO] [priority:HIGH] [estimate:3h] [start:2026-01-25] [end:2026-01-25]
- [ ] Test with simulated timeout in staging [labels:type:qa] [status:TODO] [priority:HIGH] [estimate:2h] [start:2026-01-26] [end:2026-01-26]

**SLA:** HIGH (4-8h to resolve) — ETA: 2026-01-27

---

## BUG-003: Backend API Unavailable Causes UI Crash

**Area:** frontend, backend  
**Priority:** HIGH  
**Status:** INVESTIGATING  
**Reported:** 2026-01-21  
**Affected:** Proposal list view, governance flows

### Description

When backend API is unreachable, entire proposal list view crashes instead of showing cached/placeholder data.

**Severity:** High  
**Impact:** Network issues or backend downtime render app completely non-functional.

### Steps to Reproduce

1. Load proposal list view (backend API working)
2. Disconnect backend (simulate network issue or backend restart)
3. Observe: View crashes with error, no fallback
4. Expected: Show cached proposals or placeholder message
5. Actual: JavaScript error, blank screen

### Root Cause

**Hypotheses (under investigation):**
- No error boundary wrapping proposal view
- API errors not caught in TanStack Query hooks
- No cached/fallback data available

**Related Code:**
- `src/modules/governance/ProposalList.tsx` — main list view
- `src/hooks/useProposalList.ts` — data fetching

### Investigation Progress

- [ ] Check error handling in TanStack Query hooks [labels:type:investigation] [status:TODO] [priority:HIGH] [estimate:2h]
- [ ] Review error boundary coverage [labels:type:investigation] [status:TODO] [priority:HIGH] [estimate:2h]
- [ ] Check cache strategy (staleTime, gcTime) [labels:type:investigation] [status:TODO] [priority:HIGH] [estimate:2h]

### Solution (Proposed)

- [ ] Add error boundary to proposal view [labels:type:fix] [status:TODO] [priority:HIGH] [estimate:2h] [start:2026-01-22] [end:2026-01-22]
- [ ] Implement graceful error handling in hooks [labels:type:feature] [status:TODO] [priority:HIGH] [estimate:4h] [start:2026-01-22] [end:2026-01-23]
- [ ] Show "API unavailable" message with retry button [labels:type:feature] [status:TODO] [priority:HIGH] [estimate:3h] [start:2026-01-24] [end:2026-01-24]
- [ ] Cache proposals with longer staleTime [labels:type:feature] [status:TODO] [priority:MEDIUM] [estimate:2h] [start:2026-01-25] [end:2026-01-25]
- [ ] Test with backend unavailable scenario [labels:type:qa] [status:TODO] [priority:HIGH] [estimate:2h] [start:2026-01-26] [end:2026-01-26]

**SLA:** HIGH (4-8h to resolve) — ETA: 2026-01-25

---

## Known Issues (Low Priority)

### KI-001: Proposal List Load Time > 2s

**Status:** Known Limitation  
**Severity:** Low  
**Workaround:** Paginate results on backend (current: 100 per page)

Proposal list takes 2-3 seconds to render with 100 items. Pagination planned for Q2.

**Planned Fix:** Implement pagination + virtualization (Q2)

---

### KI-002: Mobile UI Layout Issues

**Status:** Known Limitation  
**Severity:** Low  
**Workaround:** Use landscape mode on mobile for better UX

Some form fields are too narrow on portrait mobile. Responsive design improvements in Q2.

**Planned Fix:** Mobile-first responsive redesign (Q2)

---

## Bug Lifecycle & Definitions

| Stage | Definition | SLA |
|-------|-----------|-----|
| **BACKLOG** | Bug identified but not prioritized | — |
| **TODO** | Bug prioritized and scheduled | — |
| **INVESTIGATING** | Root cause being analyzed | HIGH: 4-8h, MEDIUM: 8-24h |
| **IN_PROGRESS** | Fix in active development | HIGH: 4h per checkpoint |
| **UNDER_REVIEW** | Fix ready for code review | HIGH: 2-4h |
| **TESTING** | Fix undergoing QA validation | HIGH: 4-8h |
| **FIXED** | Fix deployed to staging | MEDIUM: 8-24h (total) |
| **VERIFIED** | Fix verified on production | — |

---

## Bug Reporting Process

1. **Discover**: Identify unexpected behavior
2. **Reproduce**: Document steps to reproduce
3. **Report**: Create issue with reproduction steps
4. **Investigate**: Assign owner and investigate root cause
5. **Fix**: Develop and test fix
6. **Deploy**: Deploy to staging → production
7. **Verify**: Confirm fix resolves issue

---

## Bug Fixing Workflow

**For Bugs with Investigation Status:**

1. **Investigation Phase:**
   - Set status to `INVESTIGATING`
   - Document hypotheses and tests planned
   - Update status daily with findings

2. **Fix Development:**
   - Create feature branch: `fix/BUG-NNN-short-title`
   - Implement fix with tests
   - Add error logging for debugging

3. **Verification:**
   - Test on staging environment
   - Validate original reproduction steps
   - Check for regressions in related features

4. **Deployment:**
   - Merge to develop
   - Deploy to production
   - Monitor error logs for regressions

5. **Post-Deployment:**
   - Monitor metrics for issues
   - Update status to `VERIFIED`
   - Close issue  

### Steps to Reproduce
1. Open governance/proposals view
2. Slow down network (DevTools: 3G throttle)
3. Observe proposal list stuck in "Loading..." until all metadata fetches complete

### Expected Behavior
Proposal cards render immediately with placeholder metadata; metadata loads asynchronously in background.

### Actual Behavior
Entire proposal list waits for slowest metadata fetch (can be 5-10s on slow gateways).

### Root Cause
- Metadata fetch not running in parallel with card render
- Card component awaits metadata before rendering

### Solution
- [ ] Restructure to render card with placeholder first [labels:type:feature] [status:TODO] [priority:high] [estimate:4h]
- [ ] Fetch metadata asynchronously in background [labels:type:feature] [status:TODO] [priority:high] [estimate:3h]
- [ ] Add skeleton loaders for metadata sections [labels:type:ui] [status:TODO] [priority:medium] [estimate:2h]

---

## BUG-003: Uninstall Dialog Not Shown on Chain Errors [area:frontend, area:contracts] [priority:MEDIUM]

**Description:** Uninstall warning dialog does not appear if plugin lookup fails on chain.

**Severity:** Medium  
**Status:** Under Review  
**Affected Components:** Uninstall modal, plugin resolver  
**Reported:** 2026-01-25  

### Steps to Reproduce
1. On test DAO with Delegation plugin installed
2. Temporarily break RPC connection (DevTools: offline)
3. Attempt to uninstall plugin
4. Observe no warning dialog, uninstall proceeds directly

### Expected Behavior
Warning dialog shows regardless of chain lookup status; graceful fallback.

### Actual Behavior
Error silently swallowed; uninstall UX bypassed.

### Root Cause
- No error boundary on plugin resolver call
- Fallback does not trigger confirmation dialog

### Solution
- [ ] Add error boundary around plugin lookup [labels:type:fix] [status:TODO] [priority:medium] [estimate:2h]
- [ ] Show warning dialog with "Continue anyway" fallback [labels:type:feature] [status:TODO] [priority:medium] [estimate:3h]

---

## Known Issues (Low Priority, Backlog)

### Slow proposal creation form validation
- Observed: Form validation takes >500ms on large DAOs with many custom fields
- Impact: Low (UX friction, not data loss)
- Status: Backlog; consider memoization in Q2

### Network switch does not clear cached proposals
- Observed: Switching from Harmony to other network still shows Harmony proposals briefly
- Impact: Low (resolves automatically on data fetch)
- Status: Backlog; low priority

### Metadata placeholder styling inconsistent
- Observed: Skeleton loaders do not match final content height
- Impact: Low (visual polish only)
- Status: Backlog; UX debt
