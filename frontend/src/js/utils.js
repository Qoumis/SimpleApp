"use strict";

function registerUser() {
  console.log("Registering user...");
}

// Display registered users in a table
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
            `<tr>
              <td onclick="showUserInfo(${user.id})">${user.firstName}</td>
              <td onclick="showUserInfo(${user.id})">${user.lastName}</td>
              <td class="text-end"><button class="btn btn-outline-danger" onclick="popDeleteConfrimation(${user.id}, '${user.firstName}', '${user.lastName}')">Delete</button></td>
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

//Delete a user from the database
//This function should be called when the delete button is clicked
function deleteUser(id) {
  $.ajax({
    url: "http://localhost:8080/api/user/" + id,
    type: "DELETE",
    success: function (_msg) {
      displayUsers(); // Refresh the user list after deletion
    },
    error: function (xhr) {
      console.log(xhr);
      popInfoMessage(
        "Error deleting user: " + xhr.responseText,
        "Error " + xhr.status
      );
    },
  });
}

// Pop a modal to confirm deletion of a user
function popDeleteConfrimation(id, firstName, lastName) {
  $("#DeleteConfirmation-msg").html(
    "Are you sure you want to delete user: " + firstName + " " + lastName + "?"
  );
  $("#DeleteConfirmation").modal("show");
  $("#DeleteConfirmation-btn").off("click"); // Remove any previous click events
  $("#DeleteConfirmation-btn").on("click", function () {
    deleteUser(id);
    $("#DeleteConfirmation").modal("hide");
  });
}

function showUserInfo(id) {
  console.log("Showing info for user with ID: " + id);
}

// Used to pop a modal with a message (mostly when an error occurs)
function popInfoMessage(message, title = "Error") {
  $("#InfoModal-msg").html(message);
  $("#InfoModal-label").html(title);
  $("#InfoModal").modal("show");
  $("#InfoModal-btn").off("click");
  $("#InfoModal-btn").on("click", function () {
    $("#InfoModal").modal("hide");
  });
}
