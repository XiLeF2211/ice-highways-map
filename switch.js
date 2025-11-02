/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:  switch.js
 *
 *   Desc:  Switch widget that implements ARIA Authoring Practices
 */

'use strict';

class Switch {
  constructor(domNode) {
    this.switchNode = domNode;

    this.storageMapKey = 'is_nether';
    this.restoreState();

    this.switchNode.addEventListener('click', () => this.toggleStatus());
    this.switchNode.addEventListener('keydown', (event) =>
      this.handleKeydown(event)
    );
  }

  restoreState(){
    const savedState = localStorage.getItem(this.storageMapKey);
    if (savedState !== null) {
      const isChecked = savedState === 'true';
      this.switchNode.setAttribute('aria-checked', String(isChecked));
    }
  }
  saveState(state) {
    localStorage.setItem(this.storageMapKey, state);
  }

  handleKeydown(event) {
    // Only do something when space or return is pressed
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleStatus();
    }
  }

  // Switch state of a switch
  toggleStatus() {
    const currentState =
      this.switchNode.getAttribute('aria-checked') === 'true';
    const newState = String(!currentState);
    localStorage.setItem("is_nether", newState);

    this.saveState(newState);
    this.switchNode.setAttribute('aria-checked', newState);
  }
}

// Initialize switches
window.addEventListener('load', function () {
  // Initialize the Switch component on all matching DOM nodes
  Array.from(document.querySelectorAll('[role^=switch]')).forEach(
    (element) => new Switch(element)
  );
});

// const mapBtn = document.getElementById("map-switcher-btn")
// window.addEventListener("change", () => {
//   localStorage.
// });
