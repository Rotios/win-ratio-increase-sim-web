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
import { handleEvent } from './simulator.js';
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
          label="New Average Win Rate"
          .value=${response.mode.wins / response.mode.battles}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Average Battles Required"
          .value=${response.mode.battles}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Average Wins"
          .value=${response.mode.wins}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Average Losses"
          .value=${response.mode.losses}
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
          .value=${response.maxAllowedBattles}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-grid .items=${statistics}>
        <vaadin-grid-column
          path="battlesSimulated"
          header="Battles Simulated"
        ></vaadin-grid-column>
        <vaadin-grid-column
          path="newStats.wins"
          header="Wins"
        ></vaadin-grid-column>
        <vaadin-grid-column
          path="newStats.losses"
          header="Losses"
        ></vaadin-grid-column>
        <vaadin-grid-column
          path="newStats.battles"
          header="Battles"
        ></vaadin-grid-column>
        <vaadin-grid-column
          path="percent"
          header="New Avg WR"
        ></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  protected render() {
    if (this.input === undefined) {
      return html``;
    }
    return until(this.getResults(), html`Loading...`);
  }
}
