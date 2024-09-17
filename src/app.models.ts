import { TemplateResult, html } from 'lit';

import './win-rate-simulator/win-ratio-increase-sim-web.js';
import './kill-death-simulator/kd-increase-sim.js';
import './wn8-increase-sim/wn8-increase-sim.js';

export interface ViewType {
  id: number;
  actionText: string;
  html: TemplateResult;
}

export const VIEW_TYPES: ViewType[] = [
  {
    id: 0,
    actionText: 'Win Rate',
    html: html`<win-ratio-increase-sim-web></win-ratio-increase-sim-web>`,
  },
  {
    id: 1,
    actionText: 'K/D Ratio',
    html: html`<kd-simulation-page></kd-simulation-page>`,
  },
  {
    id: 2,
    actionText: 'WN8 Average',
    html: html`<wn8-simulation-page></wn8-simulation-page>`,
  },
];
