import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import './form/form.js';
import './summary/summary-view.js';

@customElement('win-ratio-increase-sim-web')
export class WinRatioIncreaseSimWeb extends LitElement {
  static styles = css``;

  @property({ type: String }) header = 'Win Rate Increase Simulator';

  @property() input = undefined;

  render() {
    return html`
      <h1>${this.header}</h1>

      <p>
        Determine how quickly you can increase your win rate using this
        simulator.
      </p>
      <win-ratio-form
        @simulation_inputs=${this._simulate_input}
        @reset_inputs=${this._reset_input}
      ></win-ratio-form>

      <summary-view .input=${this.input}></summary-view>
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
