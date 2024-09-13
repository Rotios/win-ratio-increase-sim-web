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
      return html` <vaadin-button
        theme="primary"
        @click=${this.reset}
        ?disabled=${this.buttonDisabled}
        >New Simulation?
      </vaadin-button>`;
    }

    return html`
      <div class="form" @change=${this.formValueUpdated}>
        <vaadin-integer-field
          label="Battles"
          name="battles"
          .value=${this.input.battles}
          pattern="\\d+"
          required
          prevent-invalid-input
          error-message="Quantity must be a number"
        ></vaadin-integer-field>
        <vaadin-integer-field
          label="Wins"
          name="wins"
          .value=${this.input.wins}
          max=${this.input.battles}
          required
          prevent-invalid-input
          error-message="Quantity must be a number between 0 and Number of Battles: ${this
            .input.battles}"
        ></vaadin-integer-field>
        <vaadin-number-field
          label="Overall Win Rate"
          .value=${((this.input.wins / this.input.battles) * 100).toFixed(2)}
          min="0"
          readOnly="true"
          max="100"
          error-message="Quantity must be a number between 0 and 100"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Recent Average Win Rate"
          name="averageWinrate"
          .value=${this.input.averageWinrate}
          min=${((this.input.wins / this.input.battles) * 100).toFixed(2)}
          required
          max="100"
          error-message="Quantity must be a number greater than your existing win rate ${(
            (this.input.wins / this.input.battles) *
            100
          ).toFixed(2)}"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Target Win Rate"
          name="targetPercentage"
          min=${((this.input.wins / this.input.battles) * 100).toFixed(2)}
          max=${this.input.averageWinrate > 0 ? this.input.averageWinrate : 0}
          .value=${this.input.targetPercentage}
          pattern="\\d+\\.\\d+"
          required
          error-message="Quantity must be a number greater than your existing win rate of ${(
            (this.input.wins / this.input.battles) *
            100
          ).toFixed(2)} and your recent win rate of ${this.input
            .averageWinrate}"
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
    const validation = await this.validate();
    if (!validation) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('simulation_inputs', {
        detail: this.input,
        bubbles: true,
      }),
    );

    this.hideForm = true;
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
  }

  async formValueUpdated(e: { target: HTMLInputElement }) {
    if (this.errors.length > 0) {
      return;
    }
    if (e.target.name) {
      this.input = {
        ...this.input,
        [e.target.name]: parseFloat(e.target.value),
      };

      console.log(`updated ${e.target.name} with ${e.target.value}`);

      this.updateButtonState();
    }
  }

  validate() {
    return (
      this.errors.length === 0 &&
      this.input.averageWinrate > 0 &&
      this.input.battles > 0 &&
      this.input.targetPercentage > 0 &&
      this.input.wins > 0 &&
      this.input.wins / this.input.battles <
        this.input.targetPercentage / 100 &&
      this.input.targetPercentage <= this.input.averageWinrate
    );
  }

  async updateButtonState() {
    this.buttonDisabled = !this.validate();
  }
}
