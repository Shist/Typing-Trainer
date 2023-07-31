"use strict";

import {
  getTextForTyping,
  getWholeCharsAmount,
  updateUserStatistics,
} from "./main-model.js";
import {
  addCloseListenersToModalWindow,
  openModalWindowWithErrorMessage,
  checkAuthorizationAtLocalStorage,
} from "../tools/tools.js";

// Controller of Main page

let currWordsArr = [];
let currWholeSymbolsAmount = 0;
let activeWordIndex = 0;

let startTime = "default";
let intervalId = undefined;
let currWholeTimeString = "00:00:00";

let currSymbolsAmount = 0;

let currAverageSpeed = 0;
let currAverageSpeedString = "0 chars/min";

let currMistakesAmount = 0;
let currMistakesPercentString = "0.00%";

function makePrevWordInactive(wordIndex, typingInput) {
  document.querySelector(`#word-${wordIndex}`).classList.remove("active-word");
  typingInput.value = "";
}

function updateSymbolsAmount(newAmount) {
  currSymbolsAmount = newAmount;
  document.querySelector(
    ".main__symbols-typed"
  ).textContent = `${currSymbolsAmount} / ${currWholeSymbolsAmount}`;
}

function updateMistakesAmount(newAmount) {
  currMistakesAmount = newAmount;
  document.querySelector(".main__mistakes-amount").textContent =
    currMistakesAmount;
  currMistakesPercentString = `${
    currWholeSymbolsAmount
      ? ((100 * currMistakesAmount) / currWholeSymbolsAmount).toFixed(2) <= 100
        ? ((100 * currMistakesAmount) / currWholeSymbolsAmount).toFixed(2)
        : "100.00"
      : "0.00"
  }%`;
  document.querySelector(".main__mistakes-percent").textContent =
    currMistakesPercentString;
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
    currWholeTimeString = "00:00:00";
    timeLabel.textContent = currWholeTimeString;
    currAverageSpeed = 0;
    currAverageSpeedString = "0 chars/min";
    speedLabel.textContent = currAverageSpeedString;
  } else {
    const wholeMilliseconds = new Date().getTime() - startTime;
    const currMillisecondsDozens = Math.trunc((wholeMilliseconds % 1000) / 10);
    const wholeSeconds = Math.trunc(wholeMilliseconds / 1000);
    const currSeconds = wholeSeconds % 60;
    const wholeMinutes = Math.trunc(wholeSeconds / 60);
    currWholeTimeString = `${getFormattedTimeElementString(
      wholeMinutes
    )}:${getFormattedTimeElementString(
      currSeconds
    )}:${getFormattedTimeElementString(currMillisecondsDozens)}`;
    timeLabel.textContent = currWholeTimeString;
    currAverageSpeed = Math.trunc(
      (currSymbolsAmount * 60000) / wholeMilliseconds
    );
    currAverageSpeedString = `${currAverageSpeed} chars/min`;
    speedLabel.textContent = currAverageSpeedString;
  }
}

function setAllStatsToDefault(intervalId) {
  currWordsArr = [];
  currWholeSymbolsAmount = 0;
  activeWordIndex = 0;

  clearInterval(intervalId);
  updateTimerAndSpeed("default");

  updateSymbolsAmount(0);

  updateMistakesAmount(0);
}

function initTypingSession(
  btnStartTyping,
  typingTextWrapper,
  sentencesAmountSlider,
  typingInput
) {
  typingTextWrapper.classList.add("centered-flex-column");
  btnStartTyping.textContent = "Cancel typing";
  typingTextWrapper.innerHTML = `
      <span class="main__typing-text-start-msg">
        Getting some text from the server . . .
      </span>
      <img
        src="./assets/images/loading-spinner.svg"
        alt="Loading"
        class="loading-spinner"
      />`;
  getTextForTyping(sentencesAmountSlider.value)
    .then((wordsArr) => {
      typingTextWrapper.innerHTML = "";
      currWordsArr = wordsArr;
      startTime = new Date().getTime();
      intervalId = setInterval(updateTimerAndSpeed, 10);
      currWholeSymbolsAmount = getWholeCharsAmount(wordsArr);
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
    })
    .catch((error) => {
      const errorMsg = `Error while trying to get some text from the server: ${error}`;
      openModalWindowWithErrorMessage(errorMsg);
      console.error(errorMsg);
      typingTextWrapper.innerHTML = `
          <span class="main__typing-text-start-msg">
            An error occurred while trying to fetch some text from the server. 
            Try again later or refresh the page.
          </span>`;
    })
    .finally(() => {
      typingTextWrapper.classList.remove("centered-flex-column");
    });
}

function initMain() {
  document.addEventListener("DOMContentLoaded", () => {
    checkAuthorizationAtLocalStorage();

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
        if (localStorage.getItem("currentUser")) {
          initTypingSession(
            btnStartTyping,
            typingTextWrapper,
            sentencesAmountSlider,
            typingInput
          );
        } else {
          const modalWindowWrapper = document.createElement("div");
          modalWindowWrapper.classList.add("modal-window-wrapper");
          modalWindowWrapper.innerHTML = `
            <div class="modal-window-wrapper__window">
                <button class="modal-window-wrapper__close-btn"></button>
                <h3 class="modal-window-wrapper__headline">Guest mode</h3>
                <p class="modal-window-wrapper__text-info">
                    You are in the guest mode at the moment. In this mode you cannot save the statistics of your workouts 
                    in the personal account. Would you like to sign in or start typing anyway?
                </p>
                <div class="modal-window-wrapper__btns-wrapper">
                    <a href="./sign-in.html" class="modal-window-wrapper__btn-sign-in">Sign in</a>
                    <button class="modal-window-wrapper__btn-start-anyway">Start anyway</button>
                </div>
            </div>
            `;
          document.body.append(modalWindowWrapper);
          addCloseListenersToModalWindow(modalWindowWrapper, false);
          const modalWindowSignInBtn = document.querySelector(
            ".modal-window-wrapper__btn-sign-in"
          );
          modalWindowSignInBtn.addEventListener("click", () => {
            document.href = "./sign-in.html";
          });
          const modalWindowStartAnywayBtn = document.querySelector(
            ".modal-window-wrapper__btn-start-anyway"
          );
          modalWindowStartAnywayBtn.addEventListener("click", () => {
            modalWindowWrapper.remove();
            initTypingSession(
              btnStartTyping,
              typingTextWrapper,
              sentencesAmountSlider,
              typingInput
            );
          });
        }
      } else {
        const modalWindowWrapper = document.createElement("div");
        modalWindowWrapper.classList.add("modal-window-wrapper");
        modalWindowWrapper.innerHTML = `
          <div class="modal-window-wrapper__window">
              <button class="modal-window-wrapper__close-btn"></button>
              <h3 class="modal-window-wrapper__headline">Cancellation</h3>
              <p class="modal-window-wrapper__text-info">
                  You have not completed your workout yet. If you cancel it you will lose your progress 
                  and the text will have to be typed again. Continue cancellation?
              </p>
              <div class="modal-window-wrapper__btns-wrapper">
                  <button class="modal-window-wrapper__btn-resume-typing">Resume typing</button>
                  <button class="modal-window-wrapper__btn-confirm-cancellation">Confirm cancellation</button>
              </div>
          </div>
          `;
        document.body.append(modalWindowWrapper);
        addCloseListenersToModalWindow(modalWindowWrapper, false);
        const modalWindowResumeTypingBtn = document.querySelector(
          ".modal-window-wrapper__btn-resume-typing"
        );
        modalWindowResumeTypingBtn.addEventListener("click", () => {
          modalWindowWrapper.remove();
        });
        const modalWindowConfirmCancellationBtn = document.querySelector(
          ".modal-window-wrapper__btn-confirm-cancellation"
        );
        modalWindowConfirmCancellationBtn.addEventListener("click", () => {
          modalWindowWrapper.remove();
          btnStartTyping.textContent = "Start typing";
          typingInput.disabled = true;
          sentencesAmountSlider.disabled = false;
          typingInput.classList.remove("input-with-error");
          typingTextWrapper.innerHTML = `
                  <span class="main__typing-text-start-msg">Here will be the text . . .</span>
              `;
          setAllStatsToDefault(intervalId);
        });
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
        makePrevWordInactive(activeWordIndex, typingInput);
        updateSymbolsAmount(
          currSymbolsAmount + currWordsArr[activeWordIndex].length
        );
        typingInput.value = "";
        btnStartTyping.textContent = "Start typing";
        typingInput.disabled = true;
        sentencesAmountSlider.disabled = false;
        typingTextWrapper.innerHTML = `
                <span class="main__typing-text-start-msg">Here will be the text . . .</span>
            `;
        const modalWindowWrapper = document.createElement("div");
        modalWindowWrapper.classList.add("modal-window-wrapper");
        modalWindowWrapper.innerHTML = `
          <div class="modal-window-wrapper__window">
              <button class="modal-window-wrapper__close-btn"></button>
              <h3 class="modal-window-wrapper__headline">&#129395 Сongratulations! &#129395</h3>
              <p class="modal-window-wrapper__text-info">
                  You have successfully completed typing!
              </p>
              <div class="modal-window-wrapper__stats-wrapper">
                  <span class="modal-window-wrapper__whole-time-label">Whole time:</span>
                  <span class="modal-window-wrapper__whole-time">${currWholeTimeString}</span>
                  <span class="modal-window-wrapper__symbols-typed-label">Symbols typed:</span>
                  <span class="modal-window-wrapper__symbols-typed">${currSymbolsAmount}</span>
                  <span class="modal-window-wrapper__current-speed-label">Average speed:</span>
                  <span class="modal-window-wrapper__symbols-speed">${currAverageSpeedString}</span>
                  <span class="modal-window-wrapper__mistakes-amount-label">Mistakes made:</span>
                  <span class="modal-window-wrapper__mistakes-amount">${currMistakesAmount}</span>
                  <span class="modal-window-wrapper__mistakes-percent-label">Mistakes percent:</span>
                  <span class="modal-window-wrapper__mistakes-percent">${currMistakesPercentString}</span>
              </div>
              <button class="modal-window-wrapper__btn-ok">OK</button>
          </div>
          `;
        document.body.append(modalWindowWrapper);
        addCloseListenersToModalWindow(modalWindowWrapper, false);
        const modalWindowOkBtn = document.querySelector(
          ".modal-window-wrapper__btn-ok"
        );
        modalWindowOkBtn.addEventListener("click", () => {
          modalWindowWrapper.remove();
        });
        if (localStorage.getItem("currentUser")) {
          updateUserStatistics(
            localStorage.getItem("currentUser"),
            currSymbolsAmount,
            currAverageSpeed,
            currMistakesAmount,
            Number(currMistakesPercentString.split("%")[0])
          )
            .then((response) => {
              console.log(
                `User statistics has been successfully updated! Response: ${response}`
              );
            })
            .catch((error) => {
              const errorMsg = `Error while updating user statistics: ${error}`;
              openModalWindowWithErrorMessage(errorMsg);
              console.error(errorMsg);
            });
        }
        setAllStatsToDefault(intervalId);
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
