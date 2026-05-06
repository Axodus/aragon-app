export type DaoOperatingDashboardView =
  | 'federation'
  | 'governance'
  | 'treasury'
  | 'execution'
  | 'plugins'
  | 'permissions'

export interface ChainExecutionStatus {
  readonly chainId: number
  readonly chainSlug: string
  readonly role: 'execution' | 'voting' | 'spoke'
  readonly status: 'idle' | 'syncing' | 'pending' | 'executed' | 'failed'
  readonly latestMessageId?: string
  readonly latestTransactionHash?: string
}

export interface DaoOperatingDashboardState {
  readonly daoId: string
  readonly federationId?: string
  readonly activeView: DaoOperatingDashboardView
  readonly chains: readonly ChainExecutionStatus[]
}
