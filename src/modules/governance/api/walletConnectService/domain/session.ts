// Object containing information on connection sessions.
// Note: keep this type structural to avoid TypeScript conflicts when multiple @walletconnect/types
// versions are present in the dependency graph.
export type ISession = {
	topic: string;
	[key: string]: unknown;
};
