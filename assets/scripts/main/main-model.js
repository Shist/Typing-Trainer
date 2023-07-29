"use strict";

import { getData } from "../services/services.js";

// Model of Main page

async function getTextForTyping(sentencesAmount) {
  const textData = await getData(
    `https://baconipsum.com/api/?type=meat-and-filler&sentences=${sentencesAmount}`
  );
  const textSpansArr = textData[0].split(" ");
  return textSpansArr;
}

export { getTextForTyping };
