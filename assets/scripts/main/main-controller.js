"use strict";

import { getTextForTyping } from "./main-model.js";

// Controller of Main page

let currWordsArr = [];
let activeWordIndex = 0;
let currSymbolsAmount = 0;

function makePrevWordInactive(wordIndex, typingInput) {
  document.querySelector(`#word-${wordIndex}`).classList.remove("active-word");
  typingInput.value = "";
}

function updateSymbolsAmount(newAmount, symbolsAmountLabel) {
  currSymbolsAmount = newAmount;
  symbolsAmountLabel.textContent = currSymbolsAmount;
}

function initMain() {
  document.addEventListener("DOMContentLoaded", () => {
    const sentencesAmountSlider = document.querySelector("#sentencesAmount");
    const sentencesAmountLabel = document.querySelector(
      ".main__current-sentences-amount"
    );
    const btnStartTyping = document.querySelector(".main__btn-start-typing");
    const timeLabel = document.querySelector(".main__whole-time");
    const symbolsAmountLabel = document.querySelector(".main__symbols-typed");
    const speedLabel = document.querySelector("main__symbols-typed");
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
        typingInput.classList.remove("input-with-error");
        typingInput.value = "";
        getTextForTyping(sentencesAmountSlider.value).then((wordsArr) => {
          typingTextWrapper.innerHTML = "";
          currWordsArr = wordsArr;
          activeWordIndex = 0;
          currSymbolsAmount = 0;
          updateSymbolsAmount(currSymbolsAmount, symbolsAmountLabel);
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
      if (typingInput.value === `${currWordsArr[activeWordIndex]} `) {
        makePrevWordInactive(activeWordIndex, typingInput);
        updateSymbolsAmount(
          currSymbolsAmount + currWordsArr[activeWordIndex].length + 1,
          symbolsAmountLabel
        );
        activeWordIndex++;
        document
          .querySelector(`#word-${activeWordIndex}`)
          .classList.add("active-word");
      } else if (
        activeWordIndex === currWordsArr.length - 1 &&
        typingInput.value === currWordsArr[activeWordIndex]
      ) {
        makePrevWordInactive(activeWordIndex, typingInput);
        updateSymbolsAmount(
          currSymbolsAmount + currWordsArr[activeWordIndex].length,
          symbolsAmountLabel
        );
      } else {
        if (currWordsArr[activeWordIndex]) {
          currWordsArr[activeWordIndex].startsWith(typingInput.value)
            ? typingInput.classList.remove("input-with-error")
            : typingInput.classList.add("input-with-error");
        }
      }
    });
  });
}

export default initMain;
