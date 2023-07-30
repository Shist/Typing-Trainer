"use strict";

function addCloseListenersToModalWindow(modalWindowWrapper) {
  const modalWindowCloseBtn = document.querySelector(
    ".modal-window-wrapper__close-btn"
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
  putAuthorizationToLocalStorage,
  removeAuthorizationFromLocalStorage,
  checkAuthorizationAtLocalStorage,
};
