import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import type { TabsSelectedChangedEvent } from '@vaadin/tabs';

import { STYLES } from './styles.js';
import './win-rate-simulator/win-ratio-increase-sim-web.js';
import './kill-death-simulator/kd-increase-sim.js';
import { VIEW_TYPES, ViewType } from './app.models.js';
import '@vaadin/tabs/theme/lumo/vaadin-tabs.js';

@customElement('main-page')
export class MainPage extends LitElement {
  static styles = STYLES;

  @property() componentInView: ViewType = {} as ViewType;

  render() {
    console.log(this.componentInView);
    return html`
      <main>
        <header>
          <vaadin-tabs @selected-changed="${this.selectedChanged}">
            ${VIEW_TYPES.map(
              type => html`<vaadin-tab>${type.actionText}</vaadin-tab>`,
            )}
          </vaadin-tabs>
        </header>
        <body>
          ${this.changeComponentInView()}
        </body>
      </main>
    `;
  }

  selectedChanged(e: TabsSelectedChangedEvent) {
    const type = VIEW_TYPES[e.detail.value];
    this.componentInView = type;
  }

  changeComponentInView() {
    switch (this.componentInView.id) {
      case 0:
        return html`<win-ratio-increase-sim-web></win-ratio-increase-sim-web>`;
      case 1:
        return html`<kd-simulation-page></kd-simulation-page>`;
      default:
        return html``;
    }
  }
}
