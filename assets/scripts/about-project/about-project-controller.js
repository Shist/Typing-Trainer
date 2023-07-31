"use strict";

import {
  toggleBurgerMenu,
  checkAuthorizationAtLocalStorage,
} from "../tools/tools.js";

// Controller of page "About project"

function initAboutProject() {
  document.addEventListener("DOMContentLoaded", () => {
    toggleBurgerMenu();
    checkAuthorizationAtLocalStorage();
  });
}

initAboutProject();
