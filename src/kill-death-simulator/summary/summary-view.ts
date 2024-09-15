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
import { SimulationInput } from '../models/kd-simulator.models.js';

@customElement('kd-summary-view')
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
          label="New Average K/D Ratio"
          .value=${response.newAverageKDRatio}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Expected Gunfights Fought"
          .value=${response.expectedBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Average Gunfights Fought"
          .value=${response.averageBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Expected Matches Required"
          .value=${Math.round((response.expectedBattlesRequired /
          response.originalInformation.averageKillsPerMatch) + 0.5)}
          readOnly="true"
        ></vaadin-text-field>
        <vaadin-text-field
          label="Average Matches Required"
          .value=${response.averageMatchesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Average Kills"
          .value=${response.averageKills}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Average Deaths"
          .value=${response.averageDeaths}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Min Gunfights Required"
          .value=${response.minBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Max Gunfights Required"
          .value=${response.maxBattlesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>
      <vaadin-horizontal-layout theme="spacing padding">
        <vaadin-text-field
          label="Min Matches Required"
          .value=${response.minMatchesRequired}
          readOnly="true"
        ></vaadin-text-field>

        <vaadin-text-field
          label="Max Matches Required"
          .value=${response.maxMatchesRequired}
          readOnly="true"
        ></vaadin-text-field>
      </vaadin-horizontal-layout>

      <vaadin-grid .items=${statistics}>
        <vaadin-grid-sort-column
          path="sessionStats.matches"
          header="Simulated Matches"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          path="battlesSimulated"
          header="Simulated Gunfights"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          path="sessionStats.kills"
          header="Simulated Gunfight Kills"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          path="sessionStats.deaths"
          header="Simulated Gunfight Deaths"
        ></vaadin-grid-sort-column>
        
        <vaadin-grid-sort-column
          path="newStats.kills"
          header="Total Account Kills"
        ></vaadin-grid-sort-column>
        <vaadin-grid-sort-column
          path="newStats.deaths"
          header="Total Account Deaths"
        ></vaadin-grid-sort-column>

        <vaadin-grid-sort-column
          path="newKDRatio"
          header="New Avg K/D"
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
