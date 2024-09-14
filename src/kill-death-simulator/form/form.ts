import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from './form.style.js';
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
import '@vaadin/number-field/theme/lumo/vaadin-number-field.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import { SimulationInput } from '../models/kd-simulator.models.js';

@customElement('kd-ratio-form')
export class WinRatioForm extends LitElement {
  static styles = STYLES;

  @property()
  private input: SimulationInput = {
    kills: 0,
    deaths: 0,
    targetKDRatio: 0,
    averageKDRatio: 0,
    averageKillsPerMatch: 0,
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
    const stepNumber = 0.00001;
    const { kills, deaths, targetKDRatio, averageKDRatio } = this.input;
    const currentKDPercent = kills / deaths;
    const currentKDPercentStr = currentKDPercent.toFixed(5);

    return html`
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-integer-field
          label="Kills"
          name="kills"
          .value=${kills}
          required
          prevent-invalid-input
          error-message="Must be a whole integer."
        ></vaadin-integer-field>

        <vaadin-integer-field
          label="Deaths"
          name="deaths"
          .value=${deaths}
          required
          prevent-invalid-input
          error-message="Must be a whole integer."
        ></vaadin-integer-field>

        <vaadin-number-field
          label="Current K/D Ratio"
          name="currentKDRatio"
          .value=${currentKDPercentStr}
          prevent-invalid-input
          step="0.00001"
          error-message="Value must be within 5 decimal places."
        ></vaadin-number-field>

        <vaadin-number-field
          label="Recent Average K/D Ratio"
          name="averageKDRatio"
          min=${currentKDPercent + stepNumber}
          max="100"
          .value=${currentKDPercent
            ? (currentKDPercent + stepNumber).toFixed(5)
            : 0}
          step=${stepNumber}
          required
          error-message="Quantity must be in increments of ${stepNumber} and greater than ${currentKDPercentStr}"
        ></vaadin-number-field>

        <vaadin-number-field
          label="Target K/D Ratio"
          name="targetKDRatio"
          min=${currentKDPercent + stepNumber}
          max=${averageKDRatio > 0 ? averageKDRatio - stepNumber : 0}
          .value=${targetKDRatio}
          step=${stepNumber}
          required
          error-message="Quantity must be in increments of ${stepNumber}, greater than ${currentKDPercentStr} and less than ${averageKDRatio}."
        ></vaadin-number-field>

        <vaadin-number-field
          label="Average Kills per Match"
          name="averageKillsPerMatch"
          min=${Math.round(averageKDRatio)}
          .value="1"
          step="1"
          required
          error-message="Quantity must be a whole number and at least ${Math.round(
            averageKDRatio,
          )}"
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
      kills: 0,
      deaths: 0,
      targetKDRatio: 0,
      averageKDRatio: 0,
      averageKillsPerMatch: 0,
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

    if (e.target.name === 'currentKDRatio') {
      const ratio = parseFloat(e.target.value);
      const kills = ratio * 100000;
      const deaths = kills / ratio;
      this.input = {
        ...this.input,
        kills,
        deaths,
      };
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
      this.input.averageKDRatio > 0 &&
      this.input.targetKDRatio > 0 &&
      this.input.kills > 0 &&
      this.input.deaths > 0 &&
      this.input.kills / this.input.deaths < this.input.targetKDRatio &&
      this.input.targetKDRatio < this.input.averageKDRatio
    );
  }
}
