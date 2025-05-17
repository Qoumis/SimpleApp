"use strict";

// Display registration form for a new user
function registerUser() {
  $("#app").load("/pages/register-user.html", function () {
    $("#birthdate").datepicker({
      dateFormat: "yy-mm-dd",
      changeYear: true,
      changeMonth: true,
      yearRange: "1900:" + (new Date().getFullYear() - 18),
      defaultDate: new Date(new Date().getFullYear() - 18, 0, 1),
    });
  });
}

$(document).on("submit", "#registration-form", function (event) {
  event.preventDefault();

  let formData = {
    firstName: $("#firstName").val(),
    lastName: $("#lastName").val(),
    gender: $("#gender").val(),
    birthDate: $("#birthdate").val(),
    homeAddress: $("#homeAddress").val(),
    workAddress: $("#workAddress").val(),
  };

  if (!formData.firstName.trim()) {
    popInfoMessage("Please enter a first name to continue!");
    return;
  }
  if (!formData.lastName.trim()) {
    popInfoMessage("Please enter a last name");
    return;
  }
  if (!formData.gender) {
    popInfoMessage("Please select a gender to continue!");
    return;
  }

  if (!isValidDate(formData.birthDate)) {
    popInfoMessage("Please enter a valid date in the format YYYY-MM-DD!");
    return;
  }

  if (!formData.homeAddress.trim()) {
    formData.homeAddress = null;
  } else {
    formData.homeAddress = { type: "HOME", FullAddress: formData.homeAddress };
  }
  if (!formData.workAddress.trim()) {
    formData.workAddress = null;
  } else {
    formData.workAddress = { type: "WORK", FullAddress: formData.workAddress };
  }

  console.log("Form data: ", formData);

  //all checks passed, send the data to the server
  $.ajax({
    url: "http://localhost:8080/api/user/add",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
      console.log(data);
      popInfoMessage("User registered successfully!", "Registration Complete");
      $("#registration-form").trigger("reset"); // empty the form after successful submission
    },
    error: function (xhr) {
      console.log(xhr);
      popInfoMessage(
        "Error registering user: " + xhr.responseJSON.error,
        "Error " + xhr.status
      );
    },
  });
});

// This function checks if the date string is in the format YYYY-MM-DD
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
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
