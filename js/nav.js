"use strict";

/******************************************************************************
 * Handling navbar clicks and updating the navigation bar
 */

/** Display the main list of all stories when the site name is clicked */
function showAllStories(evt) {
  console.debug("showAllStories", evt); // Output the event details for debugging
  hidePageComponents(); // Clear any visible components
  putStoriesOnPage(); // Populate and display the list of all stories
}

// Event listener to load all stories when the site name is clicked
$body.on("click", "#nav-all", showAllStories);

/** Display the login and signup forms when "login" is clicked */
function showLoginForms(evt) {
  console.debug("showLoginForms", evt); // Output event details for debugging
  hidePageComponents(); // Hide all currently visible components
  $loginForm.show(); // Reveal the login form
  $signupForm.show(); // Reveal the signup form
}

// Event listener to open login and signup forms when "login" is clicked
$navLogin.on("click", showLoginForms);

/** Show the story submission form when "submit" is clicked */
function showStoryForm(evt) {
  console.debug("showStoryForm", evt); // Output event details for debugging
  hidePageComponents(); // Hide all visible elements on the page
  $allStoriesList.show(); // Display the list of all stories as a background
  $submitForm.show(); // Show the form for story submission
}

// Attach an event listener for showing the story form when "submit" is clicked
$navSubmitStory.on("click", showStoryForm);

/** Display the user's favorite stories when "favorites" is clicked */
function showFavorites(evt) {
  console.debug("showFavorites", evt); // Log event details for debugging
  hidePageComponents(); // Clear all visible elements
  putFavoritesListOnPage(); // Show the list of favorited stories
}

// Event listener to display favorite stories on "favorites" click
$body.on("click", "#nav-favorites", showFavorites);

/** Show user's stories when "my stories" is clicked */
function displayUserStories(evt) {
  console.debug("displayUserStories", evt); // Log the event for debugging
  hidePageComponents(); // Clear other components from view
  putUserStoriesOnPage(); // Populate and show the user's stories
  $ownStories.show(); // Display the section for user's own stories
}

// Event listener to show user's stories when "my stories" is clicked
$body.on("click", "#nav-my-stories", displayUserStories);

/** Display the user profile section when "profile" is clicked */
function showUserProfile(evt) {
  console.debug("showUserProfile", evt); // Log event for debugging
  hidePageComponents(); // Hide other page elements
  $userProfile.show(); // Show the user profile section
}

// Attach an event listener to display the user profile on "profile" click
$navUserProfile.on("click", showUserProfile);

/** Update the navigation bar once the user is logged in */
function refreshNavOnLogin() {
  console.debug("refreshNavOnLogin"); // Log the update action
  $(".main-nav-links").css("display", "flex"); // Make main navigation links visible
  $navLogin.hide(); // Hide the login link
  $navLogOut.show(); // Display the logout link
  $navUserProfile.text(`${currentUser.username}`).show(); // Show the user's username in the profile link
}

