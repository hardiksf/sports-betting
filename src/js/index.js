import '../sass/styles.sass';
import { html, render } from 'lit-html';
import './sports-betting';
const SportsBettingElement = html`<sports-betting-element></sports-betting-element>`
render(SportsBettingElement, document.body);
