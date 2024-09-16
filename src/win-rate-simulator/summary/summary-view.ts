import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@vaadin/grid/theme/lumo/vaadin-grid.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-filter-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-selection-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-sort-column.js';
import '@vaadin/grid/theme/lumo/vaadin-grid-tree-column.js';
import '@vaadin/horizontal-layout/theme/lumo/vaadin-horizontal-layout.js';
import '@vaadin/text-field/theme/lumo/vaadin-text-field.js';

import { until } from 'lit/directives/until.js';

import { STYLES } from './summary.style.js';
import { handleEvent } from '../simulator/simulator.js';
import { SimulationInput } from '../models/simulator.models.js';

@customElement('summary-view')
export class SummaryView extends LitElement {
  static styles = STYLES;

  @property() input: undefined | SimulationInput = undefined;

  private async getResults() {
    if (!this.input) return html``;

    const response = await handleEvent(this.input);

    const statistics = [...response.statistics];

    return html`
      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Expected Battles Required"
          .value=${response.expectedBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>
      
      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Expected Wins"
          .value=${Math.round((response.expectedBattlesRequired * this.input.averageWinrate/100) + 0.5)}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Expected Losses"
          .value=${Math.round((response.expectedBattlesRequired * (1-this.input.averageWinrate/100)) - 0.5)}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="New Average Win Rate"
          .value=${response.newAverageWinrate}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Average Battles Required"
          .value=${response.averageBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Average Wins"
          .value=${response.averageWins}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Average Losses"
          .value=${response.averageLosses}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

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
          path="sessionStats.wins"
          header="Wins Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="sessionStats.losses"
          header="Losses Simulated"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.wins"
          header="Account Wins"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.losses"
          header="Account Losses"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.battles"
          header="Account Battles"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="percent"
          header="New Avg WR"
        ></vaadin-grid-sort-column>
      </vaadin-grid>
    `;
  }

  protected render() {
    if (!this.input) {
      return html``;
    }
    return until(this.getResults(), html`Loading...`);
  }
}
