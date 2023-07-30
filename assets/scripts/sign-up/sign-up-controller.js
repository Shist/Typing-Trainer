"use strict";

import {
  showElement,
  hideElement,
  isNicknameFree,
  registerAccount,
} from "./sign-up-model.js";
import { addCloseListenersToModalWindow } from "../tools/tools.js";

// Controller of page "Sign up"

function initSignUp() {
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".main__sign-up-form");
    const nicknameInput = document.querySelector("#nicknameInput");
    const passwordInput = document.querySelector("#passwordInput");
    const repeatPasswordInput = document.querySelector("#repeatPasswordInput");
    const errorMsgLabel = document.querySelector(".main__error-msg");
    const successMsgLabel = document.querySelector(".main__success-msg");
    const confirmBtn = document.querySelector(".main__confirm-btn");

    confirmBtn.addEventListener("click", (event) => {
      event.preventDefault();
      const enteredNickname = nicknameInput.value;
      const nicknameChecker = /^[a-zA-Z0-9]+$/;
      if (enteredNickname.length < 4) {
        errorMsgLabel.textContent =
          "Nickname can not be shorter than 4 characters!";
        showElement(errorMsgLabel, "block");
      } else if (enteredNickname.length > 15) {
        errorMsgLabel.textContent =
          "Nickname must not be longer than 15 characters!";
        showElement(errorMsgLabel, "block");
      } else if (!enteredNickname.match(nicknameChecker)) {
        errorMsgLabel.textContent =
          "Nickname can only contain latin letters and numbers!";
        showElement(errorMsgLabel, "block");
      } else {
        const enteredPassword = passwordInput.value;
        if (enteredPassword.length < 8) {
          errorMsgLabel.textContent =
            "Password can not be shorter than 8 characters!";
          showElement(errorMsgLabel, "block");
        } else if (enteredPassword.length > 28) {
          errorMsgLabel.textContent =
            "Password can not be longer than 28 characters!";
          showElement(errorMsgLabel, "block");
        } else if (enteredPassword !== repeatPasswordInput.value) {
          errorMsgLabel.textContent = "The entered passwords do not match!";
          showElement(errorMsgLabel, "block");
        } else {
          isNicknameFree(enteredNickname)
            .then((isFree) => {
              if (isFree) {
                hideElement(errorMsgLabel, "block");
                registerAccount(enteredNickname, enteredPassword)
                  .then((response) => {
                    form.reset();
                    const modalWindowWrapper = document.createElement("div");
                    modalWindowWrapper.classList.add("modal-window-wrapper");
                    modalWindowWrapper.innerHTML = `
                        <div class="modal-window-wrapper__window">
                            <button class="modal-window-wrapper__close-btn"></button>
                            <h3 class="modal-window-wrapper__headline">&#129395 Сongratulations! &#129395</h3>
                            <p class="modal-window-wrapper__text-info">
                                You have successfully created account!
                            </p>
                            <button class="modal-window-wrapper__btn-ok">Go to personal area</button>
                        </div>
                        `;
                    document.body.append(modalWindowWrapper);
                    addCloseListenersToModalWindow(modalWindowWrapper);
                    const modalWindowOkBtn = document.querySelector(
                      ".modal-window-wrapper__btn-ok"
                    );
                    modalWindowOkBtn.addEventListener("click", () => {
                      window.location.href = "personal-area.html";
                    });
                  })
                  .catch((error) => {
                    errorMsgLabel.textContent = `Error while adding this account to database: ${error}`;
                    showElement(errorMsgLabel, "block");
                  });
              } else {
                errorMsgLabel.textContent =
                  "A user with the same name already exists!";
                showElement(errorMsgLabel, "block");
              }
            })
            .catch((error) => {
              errorMsgLabel.textContent = `Error while checking this nickname in database: ${error}`;
              showElement(errorMsgLabel, "block");
            });
        }
      }
    });
  });
}

initSignUp();
