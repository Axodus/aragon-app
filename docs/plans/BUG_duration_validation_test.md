# BUG - AdvancedDateInputDuration Validation Test Failure

**Repository:** aragon-app(Axodus/aragon-app)  
**End Date Goal:** TBD  
**Priority:** MEDIUM  
**Estimative Hours:** 4  
**Status:** Backlog

---

## Executive Summary

The `advancedDateInputDuration.test.tsx` test `validates duration input with minimum 1 hour` fails at line 52. After setting a valid duration (2 hours), the alert component should display `infoText` instead of the error message, but the error state persists despite validation passing.

---

## Problem Description

**Test Path:** `src/shared/components/forms/advancedDateInput/advancedDateInputDuration.test.tsx:52`

**Failing Assertion:**
```typescript
await waitFor(() => expect(alert).toHaveTextContent(infoText));
```

**Test Flow:**
1. Renders component with `minDuration: { days: 0, hours: 1, minutes: 0 }` and `validateMinDuration=true`
2. Clears all inputs (minutes, hours, days → 0)
3. Sets `minutes=30` (< 1 hour minimum) → error displays ✓
4. Sets `hours=2` (>= 1 hour minimum) → error should clear, infoText should show ✗

**Current Behavior:** Error message persists even though validation should pass.

---

## Root Cause Analysis

**Suspected Issues:**
1. **Race condition in duration object construction**: `getCurrentDurationObject()` may be reading stale values from form state when called immediately after `setValue()`.
2. **Validation state not clearing**: React Hook Form's `trigger()` may not be properly clearing the error state for nested object validation.
3. **Missing TranslationsProvider**: Component uses `useTranslations()` hook, but test wrapper (`FormWrapper`) does not provide `TranslationsProvider`, potentially causing validation message lookup to fail.

**Investigation Done:**
- Enhanced `validateDuration()` with `normalizeValue()` helper to handle string inputs ✓
- Changed `recommendedMinDays` from 1 to 3 (Harmony epoch strategy) ✓
- Inspected `useFormField` hook and alert generation logic ✓
- Confirmed `FormWrapper` lacks `TranslationsProvider` ✓

---

## Remediation Steps

### Option A: Fix Race Condition (Likely Solution)
Modify `handleDurationChange()` to avoid using `getValues()` and instead compute the new duration object directly from the current state before `setValue()`.

### Option B: Add TranslationsProvider to Test Wrapper
Update `src/shared/testUtils/formWrapper.tsx` to include `TranslationsProvider`, ensuring translation lookups work in tests.

### Option C: Explicitly Clear Error State
Add explicit error state clearing after validation passes, or refactor validation to use a different RHF pattern (e.g., `watch` + custom validation).

---

## Acceptance Criteria

- [ ] Test `validates duration input with minimum 1 hour` passes consistently
- [ ] Error alert clears when valid duration is entered
- [ ] Info text displays when validation passes
- [ ] No regressions in other date input tests

---

## Risk & Rollback Notes

- **Risk:** Changing the validation flow could impact other date input components using the same utility functions.
- **Rollback:** Revert changes to `advancedDateInputDuration.tsx` and `dateUtils.ts`; restore `recommendedMinDays` to 1 if needed.

---

## Linked to Sprint #2

This bug blocks completion of TASK-002 (Prepare Flow improvements) in PLAN-001 | SPRINT-001.

