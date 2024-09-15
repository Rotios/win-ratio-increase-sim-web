import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from './form.style.js';
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
import '@vaadin/number-field/theme/lumo/vaadin-number-field.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import { SimulationInput } from '../models/simulator.models.js';

@customElement('win-ratio-form')
export class WinRatioForm extends LitElement {
  static styles = STYLES;

  @property()
  private input: SimulationInput = {
    wins: 0,
    battles: 0,
    averageWinrate: 0,
    targetPercentage: 0,
  };

  @property()
  private buttonDisabled = true;

  @property()
  private hideForm = false;

  @property()
  private errors: string[] = [];

  render() {
    if (this.hideForm) {
      return html` <vaadin-button theme="primary" @click=${this.reset}
        >New Simulation?
      </vaadin-button>`;
    }
    const stepNumber = 0.01;
    const { wins, battles, averageWinrate, targetPercentage } = this.input;
    const currentWinRate = (wins / battles) * 100;
    const currentWinRateStr = currentWinRate.toFixed(2);

    return html`
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-integer-field
          label="Battles"
          name="battles"
          .value=${battles}
          required
          prevent-invalid-input
          error-message="Quantity must be a number"
        ></vaadin-integer-field>
        <vaadin-integer-field
          label="Wins"
          name="wins"
          .value=${wins}
          max=${battles}
          required
          prevent-invalid-input
          error-message="Quantity must be a number between 0 and ${battles}"
        ></vaadin-integer-field>
        <vaadin-number-field
          label="Overall Win Rate"
          .value=${currentWinRateStr}
          readOnly="true"
          error-message="Quantity must be a number between 0 and 100"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Recent Average Win Rate"
          name="averageWinrate"
          min=${(currentWinRate + stepNumber).toFixed(2)}
          max="100"
          .value=${averageWinrate}
          step=${stepNumber}
          required
          error-message="Quantity must be in increments of 0.01 and greater than ${currentWinRate + stepNumber}"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Target Win Rate"
          name="targetPercentage"
          min=${(currentWinRate + stepNumber).toFixed(2)}
          max=${averageWinrate > 0 ? (averageWinrate - stepNumber).toFixed(2) : 0}
          .value=${targetPercentage}
          step=${stepNumber}
          required
          error-message="Quantity must be in increments of 0.01, greater than ${currentWinRateStr} and less than ${averageWinrate}."
        ></vaadin-number-field>

        <vaadin-button
          theme="primary"
          @click=${this.dispatchInputEvent}
          ?disabled=${this.buttonDisabled}
          >Simulate!
        </vaadin-button>
      </div>
      <div class="errors">
        ${this.errors.map(error => html` <p>${error}</p> `)}
      </div>
    `;
  }

  async dispatchInputEvent() {
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
    this.input = {
      wins: 0,
      battles: 0,
      averageWinrate: 0,
      targetPercentage: 0,
    };
    this.errors = [];
    this.buttonDisabled = true;
    this.hideForm = false;

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

      console.log(`updated ${e.target.name} with ${e.target.value}`);

      this.buttonDisabled = !this.validate_form();
    }
  }

  validate_form() {
    return (
      this.errors?.length === 0 &&
      this.input.averageWinrate > 0 &&
      this.input.battles > 0 &&
      this.input.targetPercentage > 0 &&
      this.input.wins > 0 &&
      this.input.wins / this.input.battles <
        this.input.targetPercentage / 100 &&
      this.input.targetPercentage < this.input.averageWinrate &&
      this.input.targetPercentage !== 100
    );
  }
}
