"use strict";

import { checkAuthorizationAtLocalStorage } from "../tools/tools.js";

// Controller of page "Typing technique"

function initTypingTechnique() {
  document.addEventListener("DOMContentLoaded", () => {
    checkAuthorizationAtLocalStorage();
  });
}

initTypingTechnique();
