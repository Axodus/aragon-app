# HOTFIX: Emergency Response & Production Incident Procedures — aragon-app

**Repository:** aragon-app (Axodus/aragon-app)  
**Last Updated:** 2026-01-21  
**Status:** No active hotfixes; 1 historical reference

---

## Overview

This document outlines emergency response procedures for critical production issues in the aragon-app frontend. Use this playbook when production outages or critical bugs are discovered.

---

## Emergency Response Process

**5-Step Emergency Response Flow**

### Step 1: ALERT (5 minutes)
- **Trigger:** Critical issue reported (app crashes, feature broken, security vulnerability)
- **Action:** Declare SEV-1/SEV-2 incident
- **Communications:**
  - Notify #emergency-incidents Slack channel
  - Page on-call engineer
  - Brief stakeholders on impact

### Step 2: INVESTIGATE (15-30 minutes)
- **Owner:** On-call engineer + subject matter expert
- **Actions:**
  - Gather error logs and stack traces
  - Reproduce issue in staging environment
  - Identify scope (user-affecting, network-specific, etc.)
  - Estimate time to fix (4h, 8h, 24h+)
- **Decision Point:**
  - Can fix in < 4h? → Proceed to FIX
  - Requires > 4h? → Plan rollback or feature flag

### Step 3: FIX (1-4 hours for hotfix)
- **Owner:** Primary developer
- **Process:**
  - Create hotfix branch: `hotfix/HOTFIX-NNN-issue-title`
  - Implement minimal fix (avoid scope creep)
  - Add test case reproducing issue
  - Peer review mandatory (< 30 min SLA)
  - Deploy to staging for validation

### Step 4: DEPLOY (30-60 minutes)
- **Owner:** DevOps + primary developer
- **Pre-Deploy Checklist:**
  - [ ] Hotfix merged to main
  - [ ] Tests passing in CI/CD
  - [ ] Rollback plan documented
  - [ ] Stakeholders notified of deploy window
- **Deploy:**
  - Deploy to production (Vercel one-click or manual)
  - Monitor error rates for 10 minutes
  - Verify fix resolves issue in production
  - Notify stakeholders of resolution

### Step 5: COMMUNICATE (Ongoing)
- **Owner:** PM or incident commander
- **Before Deploy:**
  - "We're investigating a critical issue affecting [feature]"
  - ETA for resolution
- **After Deploy:**
  - "Issue resolved as of [timestamp]"
  - Root cause summary
  - Next steps (post-mortem)

---

## SLA Levels

| Severity | Description | Alert | Investigate | Fix | Deploy | Total SLA |
|----------|-------------|-------|-------------|-----|--------|-----------|
| **CRITICAL** | App unusable, all users affected | 5 min | 15 min | 2h | 1h | **4 hours** |
| **HIGH** | Major feature broken | 15 min | 30 min | 4h | 1h | **6 hours** |
| **MEDIUM** | Minor feature broken, workaround exists | 1h | 2h | 8h | 1h | **12 hours** |
| **LOW** | Cosmetic issue, no impact | Next day | — | — | — | — |

---

## Rollback Plan Template

**Use this template if hotfix introduces new issues or doesn't resolve original problem.**

```markdown
# Rollback Plan: [Issue Name]

## Decision Criteria
- [ ] Hotfix SLA exceeded (4h+ and unresolved)
- [ ] Hotfix introduces regression (new bugs worse than original)
- [ ] Root cause requires design change (not hotfix-able)

## Rollback Steps

1. **Notify stakeholders** (Slack + email)
   - "We're rolling back to previous version due to [reason]"
   - Estimated rollback time: 30 minutes

2. **Execute rollback** (Vercel UI)
   - Click "Rollback" on previous deployment
   - Monitor error rates for 5 minutes
   - Verify original issue re-appears (expected)

3. **Communicate resolution**
   - "Rolled back to v1.2.3 (Dec 20)"
   - Original issue will be addressed in next release
   - ETA for permanent fix: [date]

4. **Plan permanent fix**
   - Create detailed issue with root cause analysis
   - Schedule for next sprint
   - Add to feature or task backlog

## Rollback Metrics

- **Total Downtime:** 30-60 minutes
- **Impact:** Users revert to previous version
- **Data Loss:** None (frontend only)
```

---

## Common Hotfix Scenarios

### Scenario 1: Proposal Card Crashes on Load

**Symptoms:**
- "Error rendering proposal" message
- Error logs: `Cannot read property 'metadata' of undefined`
- Affects 10% of proposals (those without metadata)

**Root Cause:** Missing null check in proposal rendering

**Hotfix:**
```javascript
// Before (crashes)
const title = proposal.metadata.title;

// After (safe)
const title = proposal.metadata?.title || 'Untitled Proposal';
```

**Test:**
```javascript
test('renders proposal without metadata', () => {
  const proposal = { id: 1, metadata: null };
  render(<ProposalCard proposal={proposal} />);
  expect(screen.getByText('Untitled Proposal')).toBeInTheDocument();
});
```

**Deploy:**
- Fix + test: 15 min
- Code review: 10 min
- Deploy to staging: 5 min
- Verify: 5 min
- Deploy to prod: 10 min
- **Total:** 45 minutes

---

### Scenario 2: Network Switch Causes Lost Form State

**Symptoms:**
- User fills out proposal form
- Switches Ethereum network (network selector)
- Form clears (user loses input)
- User sees error: "Form data cleared"

**Root Cause:** Network change event triggers form reset

**Hotfix:**
```javascript
// Preserve form state on network switch
const handleNetworkChange = () => {
  const formData = saveFormState();
  switchNetwork();
  restoreFormState(formData);
};
```

**Test:**
```javascript
test('preserves form state on network switch', () => {
  fillProposalForm({ title: 'Test', description: 'Test proposal' });
  switchNetwork();
  expect(getFormState()).toEqual({ title: 'Test', description: 'Test proposal' });
});
```

**Deploy:** 30-45 minutes total

---

### Scenario 3: Backend API Timeout Freezes UI

**Symptoms:**
- UI freezes when loading proposals
- No error message displayed
- User can't click buttons or close modals
- Network tab shows timeout (30s+)

**Root Cause:** Proposal list fetch has no timeout; blocks render

**Hotfix:**
```javascript
// Add timeout to fetch
const fetchWithTimeout = (url, timeout = 5000) => {
  return Promise.race([
    fetch(url),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
};
```

**Test:**
```javascript
test('shows error after 5s timeout', async () => {
  jest.useFakeTimers();
  render(<ProposalList />);
  jest.advanceTimersByTime(5000);
  expect(screen.getByText('Failed to load proposals')).toBeInTheDocument();
});
```

**Deploy:** 45-60 minutes total

---

## Historical Hotfix Reference

### HOTFIX-2026-001: Setup Form Validation Error

**Status:** RESOLVED (2026-01-18)  
**Severity:** HIGH  
**Time to Resolve:** 2.5 hours  
**SLA:** 6-hour target (✅ MET)

**Description:** Validator address input accepted invalid addresses (non-hex), allowing user to submit setup with bad data.

**Root Cause:** Missing hex validation on input change

**Fix:** Added address validation regex + real-time feedback

**Deployment:** 2026-01-18 16:00 UTC  
**Verification:** All setup forms re-tested on staging

**Lessons Learned:**
- Input validation critical for form UX
- Add real-time validation feedback
- Include negative test cases in QA

---

## Post-Incident Post-Mortem Template

**Use this after every CRITICAL or HIGH severity incident.**

```markdown
# Post-Mortem: [Incident Name]

## Timeline

- **16:00 UTC:** User reports app crash with specific proposal ID
- **16:15 UTC:** Issue confirmed on staging (reproducible)
- **16:45 UTC:** Root cause identified (missing null check)
- **17:00 UTC:** Hotfix deployed to production
- **17:10 UTC:** Monitoring shows error rate back to baseline

**Total Incident Duration:** 70 minutes

## Root Cause Analysis

**Why did this happen?**
- Proposal metadata can be null (edge case)
- Code didn't handle null case
- QA didn't test this scenario

**Why didn't we catch this earlier?**
- Limited test coverage for null metadata
- No integration tests with real data

## Action Items

- [ ] Add test case for null metadata proposals (2h)
- [ ] Enable code coverage reporting in CI (4h)
- [ ] Review all proposal fields for null handling (6h)
- [ ] Add integration tests with staging data (8h)

**Owner:** Frontend team  
**Target:** All items complete by 2026-01-25

## Communication Log

- **16:01 UTC:** #emergency-incidents notified
- **16:05 UTC:** "Issue identified, working on fix"
- **17:05 UTC:** "Fix deployed, monitoring"
- **18:00 UTC:** Post-mortem scheduled (2026-01-19 10:00 UTC)
```

---

## Escalation Contacts

| Role | Name | Slack | Email | On-Call |
|------|------|-------|-------|---------|
| Frontend Lead | [Name] | @frontend-lead | email@example.com | Yes |
| Backend Lead | [Name] | @backend-lead | email@example.com | Yes |
| DevOps | [Name] | @devops | email@example.com | Yes |
| PM | [Name] | @pm | email@example.com | No |

---

## Emergency Tools & Access

| Tool | URL | Access |  Notes |
|------|-----|--------|--------|
| Vercel Dashboard | https://vercel.com/aragon-app | Team account | Deploy/rollback |
| Error Tracking (Sentry) | https://sentry.io/aragon-app | Team account | Error logs |
| Slack Channel | #emergency-incidents | All team | Incident coordination |
| GitHub Releases | https://github.com/aragon-app/releases | Read-only | Version history |

---

## Hotfix Checklist

Before declaring hotfix complete:

- [ ] Bug reproduced in staging
- [ ] Root cause identified + documented
- [ ] Minimal fix implemented
- [ ] Test case added (negative test)
- [ ] Code reviewed + approved
- [ ] Staging deployment successful
- [ ] Fix verified in staging
- [ ] Production deployment successful
- [ ] Production monitoring (error rates, UX)
- [ ] Stakeholders notified of resolution
- [ ] Post-mortem scheduled (if SEV-1/HIGH)
