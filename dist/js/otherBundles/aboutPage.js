(()=>{"use strict";document.addEventListener("DOMContentLoaded",(function(){var e;e=document.querySelector(".header__nav"),document.querySelector(".header__burger-menu-btn").addEventListener("click",(function(){"flex"===window.getComputedStyle(e,null).display?(e.classList.remove("appeared-flex"),e.classList.add("hidden-element")):(e.classList.remove("hidden-element"),e.classList.add("appeared-flex"))})),window.addEventListener("resize",(function(){window.outerWidth>768&&(e.classList.remove("hidden-element"),e.classList.remove("appeared-flex"))})),function(){if(localStorage.getItem("currentUser")){var e=document.querySelector("#authorization-link");e.href="./personal-area.html",e.querySelector("p").textContent="Personal area";var t=e.querySelector("img");t.src="./assets/images/personal-area.png",t.alt="Personal area"}}()}))})();
//# sourceMappingURL=aboutPage.js.map