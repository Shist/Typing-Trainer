"use strict";

function checkAuthorization() {
  if (localStorage.getItem("currentUserId")) {
    const authorizationLink = document.querySelector("#authorization-link");
    authorizationLink.href = "./personal-area.html";
    authorizationLink.querySelector("p").textContent = "Personal area";
    const iconImg = authorizationLink.querySelector("img");
    iconImg.src = "./assets/images/personal-area.png";
    iconImg.alt = "Personal area";
  }
}

export { checkAuthorization };
