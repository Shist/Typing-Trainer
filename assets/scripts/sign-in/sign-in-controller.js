"use strict";

import { showElement, hideElement, getNicknameData } from "./sign-in-model.js";
import { putAuthorizationToLocalStorage } from "../tools/tools.js";

// Controller of page "Sign in"

function initSignIn() {
  document.addEventListener("DOMContentLoaded", () => {
    const nicknameInput = document.querySelector("#nicknameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const errorMsgLabel = document.querySelector(".main__error-msg");
    const confirmBtn = document.querySelector(".main__confirm-btn");

    confirmBtn.addEventListener("click", (event) => {
      event.preventDefault();
      hideElement(errorMsgLabel, "block");
      const enteredNickname = nicknameInput.value;
      const enteredPassword = passwordInput.value;
      if (!enteredNickname.trim()) {
        errorMsgLabel.textContent = "Nickname can not be empty!";
        showElement(errorMsgLabel, "block");
      } else if (!enteredPassword) {
        errorMsgLabel.textContent = "Password can not be empty!";
        showElement(errorMsgLabel, "block");
      } else {
        const spinnerImg = document.createElement("img");
        spinnerImg.src = "./assets/images/loading-spinner.svg";
        spinnerImg.alt = "Loading";
        spinnerImg.classList.add(
          "loading-spinner",
          "loading-spinner_with-margin-bottom"
        );
        passwordInput.insertAdjacentElement("afterend", spinnerImg);
        getNicknameData(enteredNickname)
          .then((user) => {
            if (!user) {
              errorMsgLabel.textContent =
                "User with that name is not registered!";
              showElement(errorMsgLabel, "block");
            } else {
              if (enteredPassword !== user.password) {
                errorMsgLabel.textContent =
                  "User with that name exists, but the password is incorrect!";
                showElement(errorMsgLabel, "block");
              } else {
                hideElement(errorMsgLabel, "block");
                putAuthorizationToLocalStorage(enteredNickname);
                window.location.href = "./personal-area.html";
              }
            }
          })
          .catch((error) => {
            const errorMsg = `Error while checking user at database: ${error}`;
            errorMsgLabel.textContent = errorMsg;
            showElement(errorMsgLabel, "block");
          })
          .finally(() => {
            spinnerImg.remove();
          });
      }
    });
  });
}

initSignIn();
