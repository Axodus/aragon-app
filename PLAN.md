# Harmony Plugins Frontend Update Plan

## Task Breakdown
- [x] Identify Harmony mainnet plugin address fields in network definitions.
- [x] Update Harmony HIP and Delegation repo addresses plus allowlist/registry references.
- [ ] Validate TypeScript types and format consistency.
- [ ] Summarize changes for UI testing.

## Implementation Steps
1. Update Harmony mainnet `harmonyPlugins` addresses in the network definitions.
2. Ensure any dependent UI/network utilities still compile.
3. Keep changes minimal and scoped to Harmony mainnet only.

## Dependencies & Integration Points
- Network definitions: `src/shared/constants/networkDefinitions.ts`.
- Harmony plugin repos and allowlist/registry addresses from the deployment record.

## Expected Outcomes & Acceptance Criteria
- Harmony mainnet uses the new HIP/Delegation plugin repo addresses.
- Harmony mainnet references the latest allowlist proxy and opt-in registry.
- No unrelated network definitions are modified.
