"use strict";

import { getTextForTyping, getWholeCharsAmount } from "./main-model.js";

// Controller of Main page

let currWordsArr = [];
let currWholeCharsCount = 0;
let activeWordIndex = 0;
let startTime = "default";
let intervalId = undefined;
let currSymbolsAmount = 0;
let currMistakesAmount = 0;

function makePrevWordInactive(wordIndex, typingInput) {
  document.querySelector(`#word-${wordIndex}`).classList.remove("active-word");
  typingInput.value = "";
}

function updateSymbolsAmount(newAmount) {
  currSymbolsAmount = newAmount;
  document.querySelector(
    ".main__symbols-typed"
  ).textContent = `${currSymbolsAmount} / ${currWholeCharsCount}`;
}

function updateMistakesAmount(newAmount) {
  currMistakesAmount = newAmount;
  document.querySelector(".main__mistakes-amount").textContent =
    currMistakesAmount;
  document.querySelector(".main__mistakes-percent").textContent = `${
    currWholeCharsCount
      ? ((100 * currMistakesAmount) / currWholeCharsCount).toFixed(2) <= 100
        ? ((100 * currMistakesAmount) / currWholeCharsCount).toFixed(2)
        : "100.00"
      : "0.00"
  }%`;
}

function getFormattedTimeElementString(number) {
  let timeNumberLabel = number.toString();
  if (timeNumberLabel.length === 1) {
    timeNumberLabel = `0${timeNumberLabel}`;
  }
  return timeNumberLabel;
}

function updateTimerAndSpeed() {
  const timeLabel = document.querySelector(".main__whole-time");
  const speedLabel = document.querySelector(".main__symbols-speed");
  if (arguments[0] && arguments[0] === "default") {
    timeLabel.textContent = "00:00:00";
    speedLabel.textContent = "0";
  } else {
    const wholeMilliseconds = new Date().getTime() - startTime;
    const currMillisecondsDozens = Math.trunc((wholeMilliseconds % 1000) / 10);
    const wholeSeconds = Math.trunc(wholeMilliseconds / 1000);
    const currSeconds = wholeSeconds % 60;
    const wholeMinutes = Math.trunc(wholeSeconds / 60);
    timeLabel.textContent = `${getFormattedTimeElementString(
      wholeMinutes
    )}:${getFormattedTimeElementString(
      currSeconds
    )}:${getFormattedTimeElementString(currMillisecondsDozens)}`;
    speedLabel.textContent = `${Math.trunc(
      (currSymbolsAmount * 60000) / wholeMilliseconds
    )} chars/min`;
  }
}

function setAllStatsToDefault(intervalId) {
  currWordsArr = [];
  currWholeCharsCount = 0;
  activeWordIndex = 0;
  clearInterval(intervalId);
  updateTimerAndSpeed("default");
  updateSymbolsAmount(0);
  updateMistakesAmount(0);
}

function initMain() {
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
      typingInput.value = "";
      if (btnStartTyping.textContent === "Start typing") {
        btnStartTyping.textContent = "Cancel typing";
        getTextForTyping(sentencesAmountSlider.value).then((wordsArr) => {
          typingTextWrapper.innerHTML = "";
          currWordsArr = wordsArr;
          startTime = new Date().getTime();
          intervalId = setInterval(updateTimerAndSpeed, 10);
          currWholeCharsCount = getWholeCharsAmount(wordsArr);
          updateSymbolsAmount(0);
          currWordsArr.forEach((word, index) => {
            const nextWord = document.createElement("span");
            nextWord.classList.add("typing-word");
            nextWord.id = `word-${index}`;
            nextWord.textContent = word;
            typingTextWrapper.append(nextWord);
          });
          document.querySelector("#word-0").classList.add("active-word");
          sentencesAmountSlider.disabled = true;
          typingInput.disabled = false;
          typingInput.focus();
        });
      } else {
        btnStartTyping.textContent = "Start typing";
        typingInput.disabled = true;
        sentencesAmountSlider.disabled = false;
        typingInput.classList.remove("input-with-error");
        typingTextWrapper.innerHTML = `
              <span class="main__typing-text-start-msg">Here will be the text . . .</span>
          `;
        setAllStatsToDefault(intervalId, typingTextWrapper);
      }
    });

    typingInput.addEventListener("input", () => {
      if (typingInput.value === `${currWordsArr[activeWordIndex]} `) {
        makePrevWordInactive(activeWordIndex, typingInput);
        updateSymbolsAmount(
          currSymbolsAmount + currWordsArr[activeWordIndex].length + 1
        );
        activeWordIndex++;
        document
          .querySelector(`#word-${activeWordIndex}`)
          .classList.add("active-word");
      } else if (
        activeWordIndex === currWordsArr.length - 1 &&
        typingInput.value === currWordsArr[activeWordIndex]
      ) {
        clearInterval(intervalId);
        typingInput.value = "";
        btnStartTyping.textContent = "Start typing";
        typingInput.disabled = true;
        sentencesAmountSlider.disabled = false;
        makePrevWordInactive(activeWordIndex, typingInput);
        updateSymbolsAmount(
          currSymbolsAmount + currWordsArr[activeWordIndex].length
        );
      } else {
        if (currWordsArr[activeWordIndex]) {
          if (currWordsArr[activeWordIndex].startsWith(typingInput.value)) {
            typingInput.classList.remove("input-with-error");
          } else {
            if (!typingInput.classList.contains("input-with-error")) {
              typingInput.classList.add("input-with-error");
              updateMistakesAmount(currMistakesAmount + 1);
            }
          }
        }
      }
    });
  });
}

export default initMain;
