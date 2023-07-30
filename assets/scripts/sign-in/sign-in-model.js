"use strict";

import { getData } from "../services/services.js";

// Model of page "Sign in"

function showElement(element, elementDisplayType) {
  element.classList.remove("hidden-element");
  element.classList.add(`appeared-${elementDisplayType}`);
}

function hideElement(element, elementDisplayType) {
  element.classList.remove(`appeared-${elementDisplayType}`);
  element.classList.add("hidden-element");
}

async function getNicknameData(nickname) {
  const nicknamesArr = await getData(
    `http://localhost:3000/users?nickname=${nickname}`
  );
  return nicknamesArr[0];
}

export { showElement, hideElement, getNicknameData };
