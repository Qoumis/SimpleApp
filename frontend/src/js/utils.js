"use strict";

// Display registration form for a new user
function registerUser() {
  history.pushState({}, "", "/register");
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
    formData.homeAddress = { type: "HOME", fullAddress: formData.homeAddress };
  }
  if (!formData.workAddress.trim()) {
    formData.workAddress = null;
  } else {
    formData.workAddress = { type: "WORK", fullAddress: formData.workAddress };
  }

  //all checks passed, send the data to the server
  $.ajax({
    url: "http://localhost:8080/api/user/add",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(formData),
    success: function (data) {
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
  history.pushState({}, "", "/users");
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
              <td onclick="openUserTab(${user.id})">${user.firstName}</td>
              <td onclick="openUserTab(${user.id})">${user.lastName}</td>
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

// Open a new tab the specified path, router handles the rest
function openUserTab(id) {
  window.open(`/user/${id}`, "_blank");
}

// Display user information
function showUserInfo(id) {
  history.pushState("", "", `/user/${id}`);

  //in case the user tries to access the page directly with an invalid path parameter
  if (isNaN(id)) {
    popInfoMessage("Invalid user ID", "Error 400", true);
    return;
  }

  $("#app").load("/pages/user-info.html", function () {
    $.ajax({
      url: "http://localhost:8080/api/user/" + id,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $("#firstName").html(data.firstName);
        $("#lastName").html(data.lastName);

        if (data.gender === "MALE") $("#gender").html("Male");
        else $("#gender").html("Female");

        $("#birthDate").html(data.birthDate);

        if (data.homeAddress)
          $("#homeAddress").html(data.homeAddress.fullAddress);
        if (data.workAddress)
          $("#workAddress").html(data.workAddress.fullAddress);
      },
      error: function (xhr) {
        popInfoMessage(
          "Error while fetching user: " + xhr.responseText,
          "Error " + xhr.status,
          true
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

function loadHomePaege() {
  $("#app").load("/pages/home.html");
  history.pushState(null, null, "/");
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

// Used to pop a modal with a message (mostly when an error occurs)
function popInfoMessage(message, title = "Error", returnToHome = false) {
  $("#InfoModal-msg").html(message);
  $("#InfoModal-label").html(title);
  $("#InfoModal").modal("show");
  $("#InfoModal-btn").off("click");
  $("#InfoModal-btn").on("click", function () {
    $("#InfoModal").modal("hide");

    if (returnToHome) {
      loadHomePaege();
    }
  });
}
