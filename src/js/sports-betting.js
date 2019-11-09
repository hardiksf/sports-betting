// Import the LitElement base class and html helper function
import { LitElement, html } from 'lit-element';
import data from '../data/data.json';

// Extend the LitElement base class
class SportsBettingElement extends LitElement {

    // properties getter
    static get properties() {
        return {
            isAtLeastOneSelectionActive: { type: Boolean },
            isOverlayContentUpdated: { type: Boolean },
            activeSelectionItems: { type: Array }
        };
    }

    constructor() {
        // Always call super() first
        super();
        this.isAtLeastOneSelectionActive = false;
        this.isOverlayContentUpdated = false;
        this.overlayMarkUp = [];
        this.activeSelectionItems = [];
    }

    //Result from this is stored in local file; data.json
    fetchApiAndPasseAsJson() {
        fetch('http://www.mocky.io/v2/59f08692310000b4130e9f71')
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
                console.log(jsonResponse)
            });
    };

    /**
     * Implement `render` to define a template for your element.
     *
     * You must provide an implementation of `render` for any element
     * that uses LitElement as a base class.
     */
    render() {
        //excluding data with zero market
        const filteredData = data.filter(element => element.markets.length !== 0);

        /**
         * `render` must return a lit-html `TemplateResult`.
         *
         * To create a `TemplateResult`, tag a JavaScript template literal
         * with the `html` helper function:
         */
        return html`
            <!-- template content -->
            <meta name="viewport" content="width=device-width, initial-scale=1">

            <!-- Overlay Markup -->
            <div id="navigation" class="overlay">
                <a href="javascript:void(0)" class="close-button" @click="${this.closeNavigation}">&times;</a> <!-- &times; X sign -->
                <div class="overlay-content">
                    ${this.renderOverlay()}
                </div>
            </div>

            <!-- Main screen Markup -->
            <div class="menu" @click="${this.openNavigation}">&#9776;</div><!-- &#9776; hamburger menu sign -->
            ${filteredData.map(item => html`
            <div class="game">
                <div class="name">${item.name}</div>
                ${item.markets.map(market => html`
                <hr class="line"></hr>
                <div class="market">${market.name}</div>
                <div class="bets">
                ${market.selections.map(selection => html`
                <button class="name-price" @click="${this.handleSelectionClick}">
                    <div class="${(selection.name).toLowerCase().trim().split(' ').join('-')}">${selection.name}</div>
                    <div class="price">${selection.price}</div>
                </button>
                </div>
            </div>`)}`)}`)}
        `;
    }

    renderOverlay() {
        return this.isAtLeastOneSelectionActive ?
            html`${this.renderOverlayContent()}`
            : html``;
    }

    renderOverlayContent() {
        this.isOverlayContentUpdated = false;
        this.activeSelectionItems.forEach(item => {
        })
        return this.activeSelectionItems ?
            html`
            ${this.activeSelectionItems.map(item => html`
                <!-- item.search(/\d/) finds index of first digit
                item.substring(0, item.search(/\d/)), gets text from string before occurrence of first digit-->
                <div class="${item.substring(0, item.search(/\d/)).toLowerCase().trim().split(' ').join('-')}">
                    ${item}
                    <button class="delete" @click="${this.handleDeleteClick}">&times;</button>
                </div>`)}
            `
            : html``;
    }

    openNavigation() {
        document.getElementById("navigation").style.width = "90%";
    }

    closeNavigation() {
        document.getElementById("navigation").style.width = "0%";
    }

    handleDeleteClick(e) {
        const targetedClassName = e.target.parentNode.className; // we want to remove active from parents of the element with this class
        const clickedNameAndPriceText = e.target.parentNode.innerText;
        const itemToBeRemoved = clickedNameAndPriceText.substring(0, clickedNameAndPriceText.length - 2);
        const parentClassOfTargetedClassInMainScreenMarkup = document.querySelector(`.name-price .${targetedClassName}`).parentNode;

        parentClassOfTargetedClassInMainScreenMarkup.classList.remove("active"); //Remove active class from Main screen Markup for item which user wants to delete from Overlay

        //filter array by removing items which are being deleted
        const filteredArray = this.activeSelectionItems.filter(element =>
            element !== itemToBeRemoved
        );

        //replace original array with filter array
        this.activeSelectionItems = filteredArray;
    }

    handleSelectionClick(e) {
        e.target.parentNode.className = `${e.target.parentNode.className} active`;
        this.isAtLeastOneSelectionActive = true;
        this.activeSelectionItems.push(e.target.parentNode.innerText.replace(/\n/g, " "));
        this.isOverlayContentUpdated = true;
    }

    createRenderRoot() {
        /**
         * Render template in light DOM. Note that shadow DOM features like
         * encapsulated CSS are unavailable.
         */
        return this;
    }
}

// Register the new element with the browser.
customElements.define('sports-betting-element', SportsBettingElement);
