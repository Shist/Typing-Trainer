"use strict";

import { getData, postData } from "../services/services.js";

// Model of page "Sign up"

function showElement(element, elementDisplayType) {
  element.classList.remove("hidden-element");
  element.classList.add(`appeared-${elementDisplayType}`);
}

function hideElement(element, elementDisplayType) {
  element.classList.remove(`appeared-${elementDisplayType}`);
  element.classList.add("hidden-element");
}

async function isNicknameFree(nickname) {
  const nicknamesArr = await getData(
    `http://localhost:3000/users?nickname=${nickname}`
  );
  if (nicknamesArr.length) {
    return false;
  } else {
    return true;
  }
}

async function registerAccount(nickname, password) {
  const response = await postData(
    "http://localhost:3000/users",
    JSON.stringify({
      nickname,
      password,
      "total-workouts": 0,
      "whole-symbols": 0,
      "average-speed": 0,
      "max-average-speed": 0,
      "whole-mistakes": 0,
      "average-mistakes-percent": 0,
    })
  );
  return response;
}

export { showElement, hideElement, isNicknameFree, registerAccount };
