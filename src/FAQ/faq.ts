import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { until } from 'lit/directives/until.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import {mdWRDoc} from './faq.md.js'

@customElement('faq-page')
export class FAQPage extends LitElement {
  static styles = css`
    :host {
        text-align: left
    }
  `;

  render() {
    return until(this.getMd(), html`loading...`);
  }

  async getMd() {
    const md = await marked(mdWRDoc)
    return html`${unsafeHTML(md)}`
  }
}
