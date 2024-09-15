import { css } from 'lit';

export const STYLES = [
  css`
    :host {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      color: #1a2b42;
      margin: 10px auto;
      padding: 10px;
      text-align: center;
      background-color: var(--win-ratio-increase-sim-web-background-color);
    }

    main {
      flex-grow: 1;
    }
  `,
];
