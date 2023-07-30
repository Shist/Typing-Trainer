"use strict";

import { removeAuthorizationFromLocalStorage } from "../tools/tools.js";
import { getData } from "../services/services.js";

// Model of page "Personal area"

function setExitListener() {
  document
    .querySelector("#authorization-link")
    .addEventListener("click", () => {
      removeAuthorizationFromLocalStorage();
    });
}

async function getUserStatistics(nickname) {
  const nicknamesArr = await getData(
    `http://localhost:3000/users?nickname=${nickname}`
  );
  return nicknamesArr[0];
}

export { setExitListener, getUserStatistics };
