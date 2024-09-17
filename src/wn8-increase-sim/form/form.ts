import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from './form.style.js';
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
import '@vaadin/number-field/theme/lumo/vaadin-number-field.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import '@vaadin/horizontal-layout/theme/lumo/vaadin-horizontal-layout.js';
import '@vaadin/vertical-layout/theme/lumo/vaadin-vertical-layout.js';
import { SimulationInput } from '../models/simulator.models.js';

@customElement('wn8-simulation-form')
export class WN8AverageForm extends LitElement {
  static styles = STYLES;

  @property()
  private input: SimulationInput = {
    battles: 1,
    lowestWn8: 0,
    averageWn8: 0,
    currentWn8: 0,
    highestWn8: 0,
    targetWn8: 0,
  };

  @property()
  private buttonDisabled = true;

  @property()
  private hideForm = false;

  @property()
  private errors: string[] = [];

  render() {
    if (this.hideForm) {
      return html`
        <vaadin-horizontal-layout theme="spacing padding">
          <vaadin-button theme="primary" @click=${this.reset}
            >New Simulation?
          </vaadin-button>
          <vaadin-button theme="primary" @click=${this.dispatchInputEvent}
            >Rerun Simulation
          </vaadin-button>
        </vaadin-horizontal-layout>
      `;
    }

    const lessThanAvg = (this.input.averageWn8 ?? 1) - 1;

    return html`
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-vertical-layout
          style="align-items: center;"
          theme="spacing padding"
        >
          <vaadin-integer-field
            label="Battles"
            name="battles"
            .value=${this.input.battles}
            required
            min="1"
            prevent-invalid-input
            error-message="Quantity must be an integer greater than 1."
          ></vaadin-integer-field>

          <vaadin-integer-field
            label="Current WN8"
            name="currentWn8"
            .value=${this.input.currentWn8}
            max=${this.input.averageWn8}
            required
            prevent-invalid-input
            error-message="Quantity must be an integer less than your average Wn8."
          ></vaadin-integer-field>

          <vaadin-integer-field
            label="Target WN8"
            name="targetWn8"
            .value=${this.input.targetWn8}
            min=${this.input.currentWn8 + 1}
            max=${lessThanAvg}
            required
            prevent-invalid-input
            error-message="Quantity must be an integer between your current WN8 and your recent average WN8."
          ></vaadin-integer-field>

          <vaadin-horizontal-layout theme="spacing padding">
            <vaadin-integer-field
              label="Lowest Average WN8"
              name="lowestWn8"
              .value=${this.input.lowestWn8}
              max=${this.input.highestWn8}
              required
              prevent-invalid-input
              error-message="Quantity must be an integer"
            ></vaadin-integer-field>
            <vaadin-integer-field
              label="Highest Average WN8"
              name="highestWn8"
              .value=${this.input.highestWn8}
              min=${this.input.lowestWn8}
              required
              prevent-invalid-input
              error-message="Quantity must be an integer greater than ${this
                .input.lowestWn8}"
            ></vaadin-integer-field>
          </vaadin-horizontal-layout>

          <vaadin-integer-field
            label="Average WN8"
            name="averageWn8"
            .value=${this.input.averageWn8}
            max=${this.input.highestWn8}
            required
            readOnly="true"
            prevent-invalid-input
            error-message="Quantity must be an integer."
          ></vaadin-integer-field>

          <vaadin-button
            theme="primary"
            @click=${this.dispatchInputEvent}
            ?disabled=${this.buttonDisabled}
            >Simulate!
          </vaadin-button>
        </vaadin-vertical-layout>
      </div>
      <div class="errors">
        ${this.errors.map(error => html` <p>${error}</p> `)}
      </div>
    `;
  }

  async dispatchInputEvent() {
    console.log('Dispatch');
    const validation = this.validate_form();
    if (!validation) {
      return;
    }

    this.hideForm = true;

    this.buttonDisabled = true;

    this.dispatchEvent(
      new CustomEvent('simulation_inputs', {
        detail: this.input,
        bubbles: true,
      }),
    );
  }

  reset() {
    this.hideForm = false;
    this.buttonDisabled = false;

    this.dispatchEvent(
      new CustomEvent('reset_inputs', {
        detail: null,
        bubbles: true,
      }),
    );
  }

  async formValueUpdated(e: { target: HTMLInputElement }) {
    if (this.errors.length > 0) {
      this.buttonDisabled = true;
      return;
    }
    if (e.target.name) {
      this.input = {
        ...this.input,
        [e.target.name]: parseFloat(e.target.value),
      };

      this.input.averageWn8 = Math.round(
        (this.input.highestWn8 + this.input.lowestWn8) / 2 - 0.5,
      );

      console.log(`updated ${e.target.name} with ${e.target.value}`);

      this.buttonDisabled = !this.validate_form();
    }
  }

  validate_form() {
    return (
      this.errors?.length === 0 &&
      !Object.values(this.input).filter(input => !input)?.length &&
      this.input.lowestWn8 < this.input.highestWn8 &&
      this.input.averageWn8 !== this.input.targetWn8 &&
      this.input.currentWn8 !== this.input.targetWn8
    );
  }
}
