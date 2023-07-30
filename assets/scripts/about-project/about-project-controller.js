"use strict";

import { checkAuthorizationAtLocalStorage } from "../tools/tools.js";

// Controller of page "About project"

function initAboutProject() {
  document.addEventListener("DOMContentLoaded", () => {
    checkAuthorizationAtLocalStorage();
  });
}

initAboutProject();
