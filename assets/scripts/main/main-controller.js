"use strict";

import { getTextForTyping } from "./main-model.js";

// Controller of Main page

function initMain() {
  let currWordsArr = [];
  let activeWordIndex = 0;
  document.addEventListener("DOMContentLoaded", () => {
    const sentencesAmountSlider = document.querySelector("#sentencesAmount");
    const sentencesAmountLabel = document.querySelector(
      ".main__current-sentences-amount"
    );
    const btnStartTyping = document.querySelector(".main__btn-start-typing");
    const typingTextWrapper = document.querySelector(
      ".main__typing-text-wrapper"
    );
    const typingInput = document.querySelector("#typingInput");

    sentencesAmountSlider.addEventListener("input", () => {
      sentencesAmountLabel.textContent = sentencesAmountSlider.value;
    });
    btnStartTyping.addEventListener("click", () => {
      if (btnStartTyping.textContent === "Start typing") {
        btnStartTyping.textContent = "Cancel typing";
        getTextForTyping(sentencesAmountSlider.value).then((wordsArr) => {
          typingTextWrapper.innerHTML = "";
          currWordsArr = wordsArr;
          activeWordIndex = 0;
          currWordsArr.forEach((word, index) => {
            const nextWord = document.createElement("span");
            nextWord.classList.add("typing-word");
            nextWord.id = `word-${index}`;
            nextWord.textContent = word;
            typingTextWrapper.append(nextWord);
          });
          document.querySelector("#word-0").classList.add("active-word");
        });
      } else {
        btnStartTyping.textContent = "Start typing";
      }
    });
    typingInput.addEventListener("input", () => {
      if (
        typingInput.value === `${currWordsArr[activeWordIndex]} ` ||
        (activeWordIndex === currWordsArr.length - 1 &&
          typingInput.value === currWordsArr[activeWordIndex])
      ) {
        document
          .querySelector(`#word-${activeWordIndex}`)
          .classList.remove("active-word");
        activeWordIndex++;
        if (activeWordIndex !== currWordsArr.length) {
          document
            .querySelector(`#word-${activeWordIndex}`)
            .classList.add("active-word");
        }
        typingInput.value = "";
      }
    });
  });
}

export default initMain;
