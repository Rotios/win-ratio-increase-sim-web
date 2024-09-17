import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@vaadin/grid/theme/lumo/vaadin-grid.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-selection-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-tree-column.js';
import '@vaadin/horizontal-layout/theme/lumo/vaadin-horizontal-layout.js';
import '@vaadin/text-field/theme/lumo/vaadin-text-field.js';
import { Notification } from '@vaadin/notification';

import { until } from 'lit/directives/until.js';

import { STYLES } from './summary.style.js';
import { handleEvent } from '../simulator/simulator.js';
import { SimulationInput } from '../models/simulator.models.js';

@customElement('wn8-simulation-summary')
export class Wn8SummaryView extends LitElement {
  static styles = STYLES;

  @property() input: undefined | SimulationInput = undefined;

  private async getResults() {
    if (!this.input) return html``;

    const response = await handleEvent(this.input);

    const statistics = [...response.statistics];

    if (response.errors.length) {
      Notification.show(
        'Expected Battles Required is too high to simulate. No simulations occurred.',
        {
          position: 'middle',
          theme: 'error',
        },
      );
    }

    return html`
      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Expected Battles Required"
          .value=${response.expectedBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-text-field
        label="Average Battles Required"
        .value=${response.averageBattlesRequired}
        readOnly="true"
      ></vaadin-text-field>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Min Battles Required"
          .value=${response.minBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Max Battles Required"
          .value=${response.maxBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-grid .items=${statistics}>
        <vaadin-grid-sort-column
          path="battlesSimulated"
          header="Battles Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="sessionStats.lowestWn8"
          header="Lowest WN8 Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="sessionStats.highestWn8"
          header="Highest Wn8 Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="sessionStats.currentWn8"
          header="Average Wn8 Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.currentWn8"
          header="Account Average Wn8"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.battles"
          header="Account Battles"
        ></vaadin-grid-sort-column>
      </vaadin-grid>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.battles}"
          label="Account Battles"
        ></vaadin-text-field>
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.currentWn8}"
          label="Current WN8"
        ></vaadin-text-field>
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.targetWn8}"
          label="Average Wn8"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>
      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.lowestWn8}"
          label="Lowest WN8"
        ></vaadin-text-field>
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.highestWn8}"
          label="Highest Wn8"
        ></vaadin-text-field>
        <vaadin-text-field
          readOnly="true"
          .value="${this.input.averageWn8}"
          label="Latest Average Wn8"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>
    `;
  }

  protected render() {
    if (!this.input) {
      return html``;
    }
    return until(this.getResults(), html`Loading...`);
  }
}
