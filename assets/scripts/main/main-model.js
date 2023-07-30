"use strict";

import { getData, putData } from "../services/services.js";

// Model of Main page

async function getTextForTyping(sentencesAmount) {
  const textData = await getData(
    `https://baconipsum.com/api/?type=meat-and-filler&sentences=${sentencesAmount}`
  );
  const textSpansArr = textData[0].split(" ");
  return textSpansArr;
}

function getWholeCharsAmount(textSpansArr) {
  return textSpansArr
    .map((word) => word.length)
    .reduce(
      (prevWordLength, nextWordLength) => prevWordLength + nextWordLength,
      textSpansArr.length - 1
    );
}

async function getUserStatistics(nickname) {
  const usersArr = await getData(
    `http://localhost:3000/users?nickname=${nickname}`
  );
  return usersArr[0];
}

async function updateUserStatistics(
  nickname,
  moreSymbols,
  currAverageSpeed,
  moreMistakes,
  currMistakesPercent
) {
  const userObj = await getUserStatistics(nickname);
  const response = await putData(
    `http://localhost:3000/users/${userObj["id"]}`,
    JSON.stringify({
      nickname: userObj["nickname"],
      password: userObj["password"],
      "total-workouts": userObj["total-workouts"] + 1,
      "whole-symbols": userObj["whole-symbols"] + moreSymbols,
      "average-speed": Math.trunc(
        (userObj["average-speed"] * userObj["total-workouts"] +
          currAverageSpeed) /
          (userObj["total-workouts"] + 1)
      ),
      "best-speed":
        currAverageSpeed > userObj["best-speed"]
          ? currAverageSpeed
          : userObj["best-speed"],
      "whole-mistakes": userObj["whole-mistakes"] + moreMistakes,
      "average-mistakes-percent": Number(
        (
          (userObj["average-mistakes-percent"] * userObj["total-workouts"] +
            currMistakesPercent) /
          (userObj["total-workouts"] + 1)
        ).toFixed(2)
      ),
    })
  );
  return response;
}

export {
  getTextForTyping,
  getWholeCharsAmount,
  getUserStatistics,
  updateUserStatistics,
};
