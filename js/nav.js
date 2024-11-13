"use strict";

/******************************************************************************
 * Handling navbar clicks and updating the navigation bar
 */

/**
 * Hides all main page components to reset the view.
 * Useful when switching between different sections,
 * so only the desired component is displayed.
 */
function hidePageComponents() {
  const components = [
    $allStoriesList, // List of all stories
    $favoritedStories, // List of favorited stories
    $ownStories, // List of user's own stories
    $loginForm, // Login form
    $signupForm, // Signup form
    $submitForm, // Story submission form
    $userProfile // User profile section
  ];
  components.forEach(component => component.hide()); // Hide each component in the list
}

/**
 * Shows the main list of all stories when "Hack or Snooze" (site name) is clicked.
 * If the user is logged in, they remain logged in.
 */
function showAllStories(evt) {
  console.debug("showAllStories", evt); // Log event for debugging

  // Hide all other components
  hidePageComponents();

  // Display the list of all stories
  putStoriesOnPage();
}

// Event listener: When "Hack or Snooze" is clicked, show all stories without logging out
$body.on("click", "#nav-all", showAllStories);

/**
 * Displays the login and signup forms when "Login/Signup" is clicked.
 */
function showLoginForms(evt) {
  console.debug("showLoginForms", evt); // Log the event for debugging

  // Hide other components
  hidePageComponents();

  // Show login and signup forms
  $loginForm.show();
  $signupForm.show();
}

// Event listener: When "Login/Signup" is clicked, show the login/signup forms
$navLogin.on("click", showLoginForms);

/**
 * Displays the story submission form when "Submit Story" is clicked.
 * This allows logged-in users to add a new story.
 */
function showStoryForm(evt) {
  console.debug("showStoryForm", evt); // Log the event for debugging

  // Hide any other visible components
  hidePageComponents();

  // Display the all stories list as a background
  $allStoriesList.show();

  // Show the story submission form
  $submitForm.show();
}

// Event listener: When "Submit Story" is clicked, show the submission form
$navSubmitStory.on("click", showStoryForm);

/**
 * Displays the user's favorite stories when "Favorites" is clicked.
 */
function showFavorites(evt) {
  console.debug("showFavorites", evt); // Log event for debugging

  // Hide any visible components
  hidePageComponents();

  // Populate and show the list of favorite stories
  putFavoritesListOnPage();
}

// Event listener: When "Favorites" is clicked, show the user's favorite stories
$body.on("click", "#nav-favorites", showFavorites);

/**
 * Displays the list of stories submitted by the logged-in user when "My Stories" is clicked.
 */
function displayUserStories(evt) {
  console.debug("displayUserStories", evt); // Log the event for debugging

  // Hide any visible components
  hidePageComponents();

  // Populate and show the user's stories list
  putUserStoriesOnPage();
  $ownStories.show(); // Show the section for the user's own stories
}

// Event listener: When "My Stories" is clicked, show the user's stories
$body.on("click", "#nav-my-stories", displayUserStories);

/**
 * Displays the user profile section when "Profile" is clicked.
 */
function showUserProfile(evt) {
  console.debug("showUserProfile", evt); // Log event for debugging

  // Hide other page components
  hidePageComponents();

  // Show the user profile section
  $userProfile.show();
}

// Event listener: When "Profile" is clicked, show the user profile section
$navUserProfile.on("click", showUserProfile);

/**
 * Updates the navigation bar when a user logs in.
 * Shows logged-in user navigation options and hides login options.
 */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin"); // Log the update for debugging

  // Show main navigation links (Submit Story, Favorites, My Stories)
  $(".main-nav-links, #nav-submit-story, #nav-favorites, #nav-my-stories").show();

  // Hide the login link as the user is now logged in
  $navLogin.hide();

  // Show the logout link
  $navLogOut.show();

  // Display the user's username in the profile link
  $navUserProfile.text(`${currentUser.username}`).show();
}

