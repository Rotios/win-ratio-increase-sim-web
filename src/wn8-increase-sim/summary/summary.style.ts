import { css } from 'lit';

export const STYLES = [
  css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--win-ratio-increase-sim-web-background-color);
    }

    vaadin-grid::part(header-cell) {
      white-space: normal;
    }

    main {
      flex-grow: 1;
    }
  `,
];
