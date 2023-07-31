"use strict";

import {
  toggleBurgerMenu,
  checkAuthorizationAtLocalStorage,
} from "../tools/tools.js";

// Controller of page "Typing technique"

function initTypingTechnique() {
  document.addEventListener("DOMContentLoaded", () => {
    toggleBurgerMenu();
    checkAuthorizationAtLocalStorage();
  });
}

export default initTypingTechnique;
