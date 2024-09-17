import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './form/form.js';
import './summary/summary-view.js';

@customElement('kd-simulation-page')
export class SimulationPage extends LitElement {
  static styles = css``;

  @property({ type: String }) header = 'K/D Increase Simulator';

  @property() input = undefined;

  render() {
    return html`
      <h1>${this.header}</h1>

      <p>
        Determine how quickly you can increase your K/D Ratio using this
        simulator.
      </p>
      <kd-ratio-form
        @simulation_inputs=${this._simulate_input}
        @reset_inputs=${this._reset_input}
      ></kd-ratio-form>

      <kd-summary-view .input=${this.input}></kd-summary-view>
    `;
  }

  private _reset_input() {
    this.input = undefined;
  }

  private _simulate_input(e: CustomEvent) {
    this.input = { ...e.detail };
    console.log(`input ${JSON.stringify(this.input)}`);
  }
}
