"use strict";

import { removeAuthorizationFromLocalStorage } from "../tools/tools.js";

// Model of page "Personal area"

function setExitListener() {
  document
    .querySelector("#authorization-link")
    .addEventListener("click", () => {
      removeAuthorizationFromLocalStorage();
    });
}

export { setExitListener };
