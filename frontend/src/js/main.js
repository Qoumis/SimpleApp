"use strict";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../css/style.css";
import $ from "jquery";

window.addEventListener("DOMContentLoaded", () => {
  $("#app").load("/pages/home.html");
});

$(document).on("click", "#home-btn", () => {
  $("#app").load("/pages/home.html");
});
