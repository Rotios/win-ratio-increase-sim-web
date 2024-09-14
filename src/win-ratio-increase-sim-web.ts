import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from './styles.js';
import './form/form.js';
import './simulator/summary-view.js';

@customElement('win-ratio-increase-sim-web')
export class WinRatioIncreaseSimWeb extends LitElement {
  static styles = STYLES;

  @property({ type: String }) header = 'Win Rate Increase Simulator';

  @property() input = undefined;

  render() {
    return html`
      <main>
        <h1>${this.header}</h1>

        <p>
          Determine how quickly you can increase your Win Rate using this
          simulator.
        </p>
        <win-ratio-form
          @simulation_inputs=${this._simulate_input}
          @reset_inputs=${this._reset_input}
        ></win-ratio-form>

        <summary-view .input=${this.input}></summary-view>
      </main>
    `;
  }

  private _reset_input(e: CustomEvent) {
    this.input = e.detail;
  }

  private _simulate_input(e: CustomEvent) {
    this.input = e.detail;
    console.log(`input ${JSON.stringify(this.input)}`);
  }
}
