import { LitElement, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { STYLES } from './styles.js';
import'./form/form.js';

const logo = new URL('../../assets/open-wc-logo.svg', import.meta.url).href;

@customElement('win-ratio-increase-sim-web')
export class WinRatioIncreaseSimWeb extends LitElement {
  @property({ type: String }) header = 'WR Increase Simulator';

  static styles = STYLES;

  render() {
    return html`
      <main>
        <div class="logo"><img alt="open-wc logo" src=${logo} /></div>
        <h1>${this.header}</h1>

        <p>Determine how quickly you can increase your Win Ratio using this simulator.</p>

        <win-ratio-form></win-ratio-form>
      </main>

      <p class="app-footer">
        
      </p>
    `;
  }
}
