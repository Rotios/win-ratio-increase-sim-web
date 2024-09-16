export interface ViewType {
  id: number;
  actionText: string;
}

export const VIEW_TYPES: ViewType[] = [
  { id: 0, actionText: 'Win Rate' },
  { id: 1, actionText: 'K/D Ratio' },
];
