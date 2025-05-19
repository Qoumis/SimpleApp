"use strict";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/style.css";
import $ from "jquery";

window.addEventListener("DOMContentLoaded", () => {
  routePage();
});

// Handle back/forward navigation
window.addEventListener("popstate", () => {
  routePage();
});

// Load the home page when home button is clicked
$(document).on("click", "#home-btn", () => {
  loadHomePaege();
});

//handle page routing
function routePage() {
  const path = window.location.pathname;

  if (path.startsWith("/user/")) {
    const id = path.split("/")[2];

    showUserInfo(id);
  } else if (path === "/register") registerUser();
  else if (path === "/users") displayUsers();
  else loadHomePaege();
}
