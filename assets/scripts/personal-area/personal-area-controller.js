"use strict";

import { setExitListener, getUserStatistics } from "./personal-area-model.js";

// Controller of page "Personal area"

function initPersonalArea() {
  document.addEventListener("DOMContentLoaded", () => {
    setExitListener();
    getUserStatistics(localStorage.getItem("currentUser"))
      .then((userObj) => {
        const nickname = document.querySelector(".main__nickname");
        const totalWorkouts = document.querySelector(".main__total-workouts");
        const wholeSymbols = document.querySelector(".main__whole-symbols");
        const averageSpeed = document.querySelector(".main__average-speed");
        const maxAverageSpeed = document.querySelector(
          ".main__max-average-speed"
        );
        const wholeMistakes = document.querySelector(".main__whole-mistakes");
        const averageMistakesPercent = document.querySelector(
          ".main__average-mistakes-percent"
        );

        nickname.textContent = userObj["nickname"];
        totalWorkouts.textContent = userObj["total-workouts"];
        wholeSymbols.textContent = userObj["whole-symbols"];
        averageSpeed.textContent = `${userObj["average-speed"]} chars/min`;
        maxAverageSpeed.textContent = `${userObj["max-average-speed"]} chars/min`;
        wholeMistakes.textContent = userObj["whole-mistakes"];
        averageMistakesPercent.textContent = `${userObj["average-mistakes-percent"]}%`;
      })
      .catch((error) => {
        console.error(`Error while trying to get user statistics: ${error}`);
      });
  });
}

initPersonalArea();
