import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './form/form.js';
import './summary/summary-view.js';

@customElement('wn8-simulation-page')
export class Wn8IncreaseSim extends LitElement {
  static styles = css``;

  @property({ type: String }) header = 'Win Rate Increase Simulator';

  @property() input = undefined;

  render() {
    return html`
      <h1>${this.header}</h1>

      <p>
        Determine how quickly you can increase your WN8 rating by using this
        simulator.
      </p>
      <p>
        <b>
          This simulator assumes you will always receive a WN8 between the upper
          and lower bound specified within the form.
        </b>
      </p>

      <p>
        <wn8-simulation-form
          @simulation_inputs=${this._simulate_input}
          @reset_inputs=${this._reset_input}
        ></wn8-simulation-form>

        <wn8-simulation-summary .input=${this.input}></wn8-simulation-summary>
      </p>
    `;
  }

  private _reset_input() {
    this.input = undefined;
  }

  private _simulate_input(e: CustomEvent) {
    this.input = { ...e.detail };
    console.log(`Received input ${JSON.stringify(this.input)}`);
  }
}
