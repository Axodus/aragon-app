# Harmony Delegation Validator Address UI Plan

## Task Breakdown
- [x] Locate Harmony Delegation setup form and install data builder.
- [x] Add validator address input for Harmony Delegation setup.
- [x] Encode validator address into installation params for Delegation only.
- [x] Provide basic validation and helper text for the input.
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
