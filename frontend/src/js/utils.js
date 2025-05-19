"use strict";

// Display registration form for a new user
function registerUser() {
  history.pushState({}, "", "/register");
  $("#app").load("/pages/register-user.html", function () {
    initializeDatePicker();
  });
}

$(document).on("submit", "#registration-form", function (event) {
  event.preventDefault();

  let formData = {
    firstName: $("#firstName").val().trim(),
    lastName: $("#lastName").val().trim(),
    gender: $("#gender").val(),
    birthDate: $("#birthdate").val(),
    homeAddress: $("#homeAddress").val().trim(),
    workAddress: $("#workAddress").val().trim(),
  };

  if (!isDataValid(formData)) return;

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

// used to validate the form data before sending it to the server
// used both on registration and edit user
function isDataValid(formData) {
  if (!formData.firstName) {
    popInfoMessage("Please enter a first name to continue!");
    return false;
  }
  if (!formData.lastName) {
    popInfoMessage("Please enter a last name");
    return false;
  }
  if (!formData.gender) {
    popInfoMessage("Please select a gender to continue!");
    return false;
  }

  if (!isValidDate(formData.birthDate)) {
    popInfoMessage("Please enter a valid date in the format YYYY-MM-DD!");
    return false;
  }

  if (!formData.homeAddress) {
    formData.homeAddress = null;
  } else {
    formData.homeAddress = { type: "HOME", fullAddress: formData.homeAddress };
  }
  if (!formData.workAddress) {
    formData.workAddress = null;
  } else {
    formData.workAddress = { type: "WORK", fullAddress: formData.workAddress };
  }

  return true;
}

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

        $("#birthdate").html(data.birthDate);

        $("#homeAddress").html(data.homeAddress?.fullAddress || "");
        $("#workAddress").html(data.workAddress?.fullAddress || "");

        $("#edit-btn").off("click");
        $("#edit-btn").on("click", function () {
          editUser(data);
        });
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

function editUser(user) {
  history.pushState({}, "", `/user/${user.id}/edit`);
  $("#app").load("/pages/edit-user.html", function () {
    $("#firstName").val(user.firstName);
    $("#lastName").val(user.lastName);
    $("#gender").val(user.gender);
    $("#birthdate").val(user.birthDate);
    initializeDatePicker();

    $("#homeAddress").val(user.homeAddress?.fullAddress || "");
    $("#workAddress").val(user.workAddress?.fullAddress || "");

    // Handle the cancel button click
    $("#cancel-btn").off("click");
    $("#cancel-btn").on("click", function () {
      window.history.back();
    });

    // Handle the update button click (submit the form)
    $(document).on("submit", "#update-form", function (event) {
      event.preventDefault();

      let formData = {
        id: user.id,
        firstName: $("#firstName").val().trim(),
        lastName: $("#lastName").val().trim(),
        gender: $("#gender").val(),
        birthDate: $("#birthdate").val(),
        homeAddress: $("#homeAddress").val().trim(),
        workAddress: $("#workAddress").val().trim(),
      };

      if (!isDataValid(formData)) return;

      showUserInfo(user.id); // Show the user info page after updating
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

// Initialize the date picker for the birthdate input field
function initializeDatePicker() {
  $("#birthdate").datepicker({
    dateFormat: "yy-mm-dd",
    changeYear: true,
    changeMonth: true,
    yearRange: "1900:" + (new Date().getFullYear() - 18),
    defaultDate: new Date(new Date().getFullYear() - 18, 0, 1),
  });
}
