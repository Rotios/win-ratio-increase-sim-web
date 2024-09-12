import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import type { WinRatioIncreaseSimWeb } from '../src/win-ratio-increase-sim-web.js';
import '../src/win-ratio-increase-sim-web.js';

describe('WinRatioIncreaseSimWeb', () => {
  let element: WinRatioIncreaseSimWeb;
  beforeEach(async () => {
    element = await fixture(html`<win-ratio-increase-sim-web></win-ratio-increase-sim-web>`);
  });

  it('renders a h1', () => {
    const h1 = element.shadowRoot!.querySelector('h1')!;
    expect(h1).to.exist;
    expect(h1.textContent).to.equal('My app');
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
