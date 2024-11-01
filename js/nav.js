"use strict";

/******************************************************************************
 * Handling navbar clicks and updating the navbar
 */

/** Show main list of all stories when clicking the site name */
function navAllStories(evt) {
  console.debug("navAllStories", evt); // Log the event for debugging
  hidePageComponents(); // Hide all other components
  putStoriesOnPage(); // Show the list of all stories
}

// Attach event listener for clicking the site name to show all stories
$body.on("click", "#nav-all", navAllStories);

/** Show login/signup forms when clicking on "login" */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt); // Log the event for debugging
  hidePageComponents(); // Hide all other components
  $loginForm.show(); // Show the login form
  $signupForm.show(); // Show the signup form
}

// Attach event listener for clicking the "login" link to show login/signup forms
$navLogin.on("click", navLoginClick);

/** Show the story submission form when clicking on "submit" */
function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt); // Log the event for debugging
  hidePageComponents(); // Hide all other components
  $newStoryForm.show(); // Show the new story submission form
}

// Attach event listener for clicking the "submit" link to show the story submission form
$navSubmit.on("click", navSubmitClick);

/** When a user logs in, update the navbar to reflect that */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin"); // Log for debugging
  $(".main-nav-links").show(); // Show the main navigation links
  $navLogin.hide(); // Hide the "login" link
  $navLogOut.show(); // Show the "logout" link
  $navUserProfile.text(`${currentUser.username}`).show(); // Show the user profile with the username
}

