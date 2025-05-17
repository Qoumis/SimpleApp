"use strict";

function registerUser() {
  console.log("Registering user...");
}

function displayUsers() {
  $("#app").load("/pages/display-users.html", function () {
    $.ajax({
      url: "http://localhost:8080/api/user/all/names",
      type: "GET",
      dataType: "json",
      success: function (data) {
        let table = $("#users-table tbody");
        data.forEach((user) => {
          table.append(
            `<tr onclick="console.log(${user.id})">
              <td>${user.firstName}</td>
              <td>${user.lastName}</td>
            </tr>`
          );
        });
      },
      error: function (xhr) {
        popInfoMessage(
          "Error fetching users: " + xhr.responseJSON.error,
          "Error " + xhr.status
        );
      },
    });
  });
}

function popInfoMessage(message, title = "Error") {
  $("#InfoModal-msg").html(message);
  $("#InfoModal-label").html(title);
  $("#InfoModal").modal("show");
  $("#InfoModal-btn").off("click");
  $("#InfoModal-btn").on("click", function () {
    $("#InfoModal").modal("hide");
  });
}
