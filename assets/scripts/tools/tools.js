"use strict";

function addCloseListenersToModalWindow(modalWindowWrapper, isError) {
  const modalWindowCloseBtn = document.querySelector(
    `.${isError ? "error-" : ""}modal-window-wrapper__close-btn`
  );
  modalWindowCloseBtn.addEventListener("click", () => {
    modalWindowWrapper.remove();
  });
  modalWindowWrapper.addEventListener("click", (event) => {
    if (event.target === modalWindowWrapper) {
      modalWindowWrapper.remove();
    }
  });
}

function openModalWindowWithErrorMessage(errorMsg) {
  const modalWindowWrapper = document.createElement("div");
  modalWindowWrapper.classList.add("modal-window-wrapper");
  modalWindowWrapper.innerHTML = `
    <div class="error-modal-window-wrapper__window">
        <button class="error-modal-window-wrapper__close-btn"></button>
        <h3 class="modal-window-wrapper__headline">Error</h3>
        <p class="modal-window-wrapper__error-info">${errorMsg}</p>
        <button class="error-modal-window-wrapper__btn-ok">OK</button>
    </div>
    `;
  document.body.append(modalWindowWrapper);
  document
    .querySelector(".error-modal-window-wrapper__btn-ok")
    .addEventListener("click", () => {
      modalWindowWrapper.remove();
    });
  addCloseListenersToModalWindow(modalWindowWrapper, true);
}

function putAuthorizationToLocalStorage(nickname) {
  localStorage.setItem("currentUser", nickname);
}

function removeAuthorizationFromLocalStorage() {
  localStorage.removeItem("currentUser");
}

function checkAuthorizationAtLocalStorage() {
  if (localStorage.getItem("currentUser")) {
    const authorizationLink = document.querySelector("#authorization-link");
    authorizationLink.href = "./personal-area.html";
    authorizationLink.querySelector("p").textContent = "Personal area";
    const iconImg = authorizationLink.querySelector("img");
    iconImg.src = "./assets/images/personal-area.png";
    iconImg.alt = "Personal area";
  }
}

export {
  addCloseListenersToModalWindow,
  openModalWindowWithErrorMessage,
  putAuthorizationToLocalStorage,
  removeAuthorizationFromLocalStorage,
  checkAuthorizationAtLocalStorage,
};
