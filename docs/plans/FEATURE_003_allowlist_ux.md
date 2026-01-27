# FEATURE-003 - HIP Plugin Allowlist UX & Admin Button Removal

**Repository:** aragon-app (Axodus/aragon-app)  
**End Date Goal:** 2026-02-03  
**Priority:** HIGH  
**Estimative Hours:** 8h  
**Status:** TODO

---

## Executive Summary

Remove direct HIP Voting plugin installation via Admin Settings Panel to enforce governance-based installation only. Add differentiated "By Request" badge for plugins requiring prior Management DAO authorization via `HIPPluginAllowlist`.

---

## Technical Context

| Item | Value |
|------|-------|
| HIPPluginAllowlist Proxy | `0x8D151e5021F495e23FbBC3180b4EeA1a6B251Fd0` |
| Management DAO | `0x700cBBB4881D286628ca9aD3d9DF390D9c0840a2` |
| Permission ID | `keccak256("MANAGE_ALLOWLIST_PERMISSION")` |
| Network | Harmony Mainnet |

---

## Already Implemented ✅

- [x] `requiresAllowlist: true` flag on HIP plugin definition
- [x] `useWhitelistValidation` hook disables plugins with `requiresAllowlist`
- [x] Generic disabled tag in `SetupBodyDialogSelect`
- [x] `HIPPluginAllowlist` contract deployed

---

## Subtasks (Linked)

### FEATURE-003 | TASK-001: Remove AdminInstallHarmonyVoting from Admin Plugin [key:01KFZJVNG75HBXTR9QCBEQT8KH]

- [ ] Delete `adminInstallHarmonyVoting.tsx` component [labels:type:task, area:ui] [status:TODO] [priority:HIGH] [estimate:30m] [start:2026-01-27] [end:2026-01-27]
- [ ] Update `index.ts` to remove export [labels:type:task, area:ui] [status:TODO] [priority:HIGH] [estimate:10m] [start:2026-01-27] [end:2026-01-27]
- [ ] Remove `<AdminInstallHarmonyVoting>` from `adminSettingsPanel.tsx` [labels:type:task, area:ui] [status:TODO] [priority:HIGH] [estimate:20m] [start:2026-01-27] [end:2026-01-27]

**Files:**
- `src/plugins/adminPlugin/components/adminSettingsPanel/components/adminInstallHarmonyVoting/adminInstallHarmonyVoting.tsx` (DELETE)
- `src/plugins/adminPlugin/components/adminSettingsPanel/components/adminInstallHarmonyVoting/index.ts` (DELETE)
- `src/plugins/adminPlugin/components/adminSettingsPanel/adminSettingsPanel.tsx` (EDIT: remove import and usage)

**Acceptance Criteria:**
- Admin Settings Panel no longer shows "Install Harmony Voting" button
- No console errors or type errors after removal
- Panel still displays `AdminManageMembers` and `AdminUninstallPlugin`

---

### FEATURE-003 | TASK-002: Add "By Request" Badge for Allowlist Plugins [key:01KFZJVNG82V747S3AK29WN3XJ]

- [ ] Update `setupBodyDialogSelect.tsx` to differentiate `requiresAllowlist` plugins [labels:type:task, area:ui] [status:TODO] [priority:HIGH] [estimate:1h] [start:2026-01-27] [end:2026-01-28]
- [ ] Add i18n keys for "By Request" label and description [labels:type:task, area:i18n] [status:TODO] [priority:MEDIUM] [estimate:30m] [start:2026-01-28] [end:2026-01-28]

**Files:**
- `src/modules/createDao/dialogs/setupBodyDialog/setupBodyDialogSelect/setupBodyDialogSelect.tsx`
- Locale files (en.json, etc.)

**Code Change:**
```tsx
{disabledPlugins.map((plugin) => (
    <RadioCard
        key={plugin.id}
        label={t(plugin.setup!.nameKey)}
        description={t(plugin.setup!.descriptionKey)}
        value={plugin.id}
        disabled={true}
        tag={{
            variant: plugin.requiresAllowlist ? 'warning' : 'info',
            label: t(
                plugin.requiresAllowlist
                    ? 'app.createDao.setupBodyDialog.select.requiresAllowlist.label'
                    : 'app.createDao.setupBodyDialog.select.disabled.label'
            ),
        }}
    />
))}
```

**i18n Keys:**
```json
{
  "app.createDao.setupBodyDialog.select.requiresAllowlist.label": "By Request",
  "app.createDao.setupBodyDialog.select.requiresAllowlist.description": "This plugin requires prior authorization. Contact the Management DAO to request access."
}
```

**Acceptance Criteria:**
- Plugins with `requiresAllowlist: true` show yellow/warning "By Request" badge
- Plugins disabled by whitelist show blue/info "Disabled" badge
- Badge text is translatable

---

### FEATURE-003 | TASK-003: (Optional) Real-time Allowlist Validation [key:01KFZJVNG98PXQYMZ38JYH9A7E]

- [ ] Add on-chain `isDAOAllowed` check in `useWhitelistValidation` [labels:type:feature, area:hooks] [status:BACKLOG] [priority:LOW] [estimate:4h] [start:TBD] [end:TBD]

**Note:** This task is optional and can be deferred to a future sprint. It would enable DAOs that have been allowlisted to install the HIP plugin without UI restrictions.

**Acceptance Criteria:**
- If DAO is in allowlist, HIP plugin becomes enabled in selection
- Graceful fallback if RPC call fails

---

### FEATURE-003 | TASK-004: Documentation - Allowlist Procedure [key:01KFZJVNGAG4NW5MJFS8AKG5E5]

- [ ] Create `docs/ALLOWLIST_PROCEDURE.md` with request flow [labels:type:docs, area:governance] [status:TODO] [priority:MEDIUM] [estimate:1h] [start:2026-01-28] [end:2026-01-28]

**Content:**
- How to request allowlist access
- How Management DAO processes requests
- How to verify authorization on-chain

**Acceptance Criteria:**
- Document exists and is linked from main docs
- Procedure is clear for both requesters and Management DAO members

---

## Milestones

| Milestone | Target Date | Tasks |
|-----------|-------------|-------|
| Admin Button Removed | 2026-01-27 | TASK-001 |
| Badge UX Complete | 2026-01-28 | TASK-002 |
| Documentation Ready | 2026-01-28 | TASK-004 |
| Sprint Complete | 2026-02-03 | All (except TASK-003 backlog) |

---

## Deliverables

1. **PR `aragon-app`**: Remove admin install button + add "By Request" badge
2. **Documentation**: `docs/ALLOWLIST_PROCEDURE.md`
3. **(Future)** GitHub Issue Template for allowlist requests

---

## Risk & Rollback

| Risk | Mitigation |
|------|------------|
| Users expect direct install | Clear UI messaging with "By Request" badge |
| i18n keys missing in some locales | Fallback to English key |
| Regression in Admin Panel | Test panel renders correctly after removal |

**Rollback:** Revert PR; component is self-contained.

---

## Allowlist Procedure Reference

### How to Add a DAO to the Allowlist

**Requirements:**
- Be a member of the Management DAO with `MANAGE_ALLOWLIST_PERMISSION`
- Have the address of the requesting DAO

**Steps:**

1. **Identify the DAO address:**
   - Requester provides their DAO address on Harmony
   - Verify on explorer: `https://explorer.harmony.one/address/{dao_address}`

2. **Create proposal in Management DAO:**
   ```solidity
   // Proposal action:
   target: 0x8D151e5021F495e23FbBC3180b4EeA1a6B251Fd0 // HIPPluginAllowlistProxy
   value: 0
   data: abi.encodeWithSelector(HIPPluginAllowlist.allowDAO.selector, daoAddress)
   ```

3. **After approval and execution:**
   - The DAO is authorized to install the HIP Voting Plugin
   - Event `DAOAllowed(address indexed dao)` is emitted

4. **Verify authorization:**
   ```solidity
   HIPPluginAllowlist(0x8D151...1Fd0).isDAOAllowed(daoAddress) // returns true
   ```

### Request Flow

```
[Requesting DAO] → [Request Form/Issue] → [Management DAO Review]
                                                    ↓
                                         [allowDAO Proposal]
                                                    ↓
                                         [Management DAO Vote]
                                                    ↓
                                         [Execution: allowDAO(daoAddress)]
                                                    ↓
                                         [DAO authorized - can install HIP]
```
