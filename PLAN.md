# Harmony Delegation Validator Address UI Plan

## Task Breakdown
- [x] Locate Harmony Delegation setup form and install data builder.
- [x] Add validator address input for Harmony Delegation setup.
- [x] Encode validator address into installation params for Delegation only.
- [x] Provide basic validation and helper text for the input.
- [x] Ensure validator address syncs into form state on input change.
- [x] Surface prepare error details in the transaction dialog.
- [x] Normalize Harmony repo addresses to lowercase to avoid checksum errors.
- [x] Display Harmony Delegation short code (TDEL) in body info.
- [x] Add Harmony proposal settings (dates + snapshot block).
- [x] Register Harmony proposal/vote builders.
- [ ] Verify prepare installation succeeds with delegation validator address.
- [ ] Summarize changes for UI testing.

## Implementation Steps
1. Add a dedicated membership component for Harmony Delegation with a validator address field.
2. Extend the Harmony voting setup form to carry `validatorAddress` for Delegation only.
3. Encode installation params with the validator address when the Delegation plugin is selected.
4. Keep HIP setup unchanged (empty install params).

## Dependencies & Integration Points
- Harmony voting setup UI: `src/plugins/harmonyVotingPlugin/components/**`.
- Installation data builder: `src/plugins/harmonyVotingPlugin/utils/harmonyVotingTransactionUtils.ts`.
- Create DAO slot registration: `src/plugins/harmonyVotingPlugin/index.ts`.

## Expected Outcomes & Acceptance Criteria
- Harmony Delegation setup requires a validator address before continuing.
- Delegation installation params include the validator address.
- HIP setup remains unchanged.
- Prepare installation succeeds without needing to explicitly accept the input.
- Prepare step surfaces the underlying error message when it fails.
- Harmony repo/allowlist/registry addresses do not trigger checksum errors.
- Harmony Delegation body subtitle shows TDEL instead of raw subdomain.
- Harmony proposals can be created with snapshot block input.
