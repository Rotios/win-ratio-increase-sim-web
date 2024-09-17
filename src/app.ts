import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import type { TabsSelectedChangedEvent } from '@vaadin/tabs';

import { STYLES } from './styles.js';
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
    return this.componentInView.html;
  }
}
