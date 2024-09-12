import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from '../styles.js';
import '@vaadin/integer-field/theme/lumo/vaadin-integer-field.js';
import '@vaadin/number-field/theme/lumo/vaadin-number-field.js';
import '@vaadin/button/theme/lumo/vaadin-button.js';
import { SimulationInput } from '../simulator/simulator.models.js';

@customElement('win-ratio-form')
export class WinRatioForm extends LitElement {
  static styles = STYLES;

  @property()
  private input: SimulationInput = {
    wins: 0,
    battles: 0,
    average_winrate: 0,
    target_percentage: 0
  };

  @property()
  private buttonDisabled = true;

  @property()
  private errors: string[] = [];

  render() {
    return html`
       <div class="form" @change=${this.formValueUpdated}>
        
        <vaadin-integer-field
          id=battles_field
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
          error-message="Quantity must be a number between 0 and Number of Battles: ${this.input.battles}"
        ></vaadin-integer-field>
        <vaadin-number-field
          label="Overall Win Rate"
          name="average_winrate"
          .value=${(this.input.wins/this.input.battles * 100).toFixed(2)}
          min=0
          readOnly=true
          max=100
          error-message="Quantity must be a number between 0 and 100"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Recent Average Win Rate"
          name="average_winrate"
          .value=${this.input.average_winrate}
          min=${(this.input.wins/this.input.battles * 100).toFixed(2)}
          required
          max=100
          error-message="Quantity must be a number greater than your existing win rate ${(this.input.wins/this.input.battles * 100).toFixed(2)}"
        ></vaadin-number-field>
        <vaadin-number-field
          label="Target Rate"
          name="target_percentage"
          min=${(this.input.wins/this.input.battles * 100).toFixed(2)}
          max=${this.input.average_winrate > 0 ? this.input.average_winrate  - 0.0001 : 0}
          .value=${this.input.target_percentage}
          pattern="\\d+\\.\\d+"
          required
          error-message="Quantity must be a number greater than your existing win rate of ${(this.input.wins/this.input.battles * 100).toFixed(2)} and your recent win rate of ${this.input.average_winrate}"
        ></vaadin-number-field>
    
        <vaadin-button theme="primary" @click=${this.start_simulation} ?disabled=${this.buttonDisabled}
          >Simulate!</vaadin-button
        >
      </div>
      <div class="errors">
        ${this.errors.map(
          error =>
            html`
              <p>${error}</p>
            `
        )}
      </div>
    `;
  }

  async start_simulation(e: any) {
    const validation = await this.validate(this.input);
    if (!validation) {
      return;
    }

    this.dispatchEvent(
        new CustomEvent('simulation_inputs', {
          detail: this.input,
          bubbles: true
        })
      );
      this.reset();
  }

  reset() {
    this.input = {
        wins: 0,
        battles: 0,
        average_winrate: 0,
        target_percentage: 0
    };
    this.errors = [];
    this.buttonDisabled = true;
  }
  

  async formValueUpdated(e: { target: HTMLInputElement }) {
    if (this.errors.length > 0) {
        return;
    }
    if (e.target.name) {
      this.input = {
        ...this.input,
        [e.target.name]: parseFloat(e.target.value)
      };

      console.log(`updated ${e.target.name} with ${e.target.value}`)

      this.updateButtonState();
    }
  }

  validate(input: SimulationInput) {
    return this.errors.length === 0 &&
        input.average_winrate > 0 && 
        input.battles > 0 && 
        input.target_percentage > 0 && 
        input.wins > 0 &&
        input.wins/input.battles < input.target_percentage/100
  }
    
  async updateButtonState() {
    this.buttonDisabled = !(this.validate(this.input));
  }
}
