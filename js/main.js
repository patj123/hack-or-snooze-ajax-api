"use strict";

// Cache commonly used DOM elements to avoid repeatedly finding them
const $body = $("body"); // Select the body element

const $storiesLoadingMsg = $("#stories-loading-msg"); // Loading message element
const $allStoriesList = $("#all-stories-list"); // List element for all stories

const $loginForm = $("#login-form"); // Login form element
const $signupForm = $("#signup-form"); // Signup form element

const $navLogin = $("#nav-login"); // Navbar "login" link
const $navSubmit = $("#nav-submit"); // Navbar "submit" link (for adding new stories)
const $navUserProfile = $("#nav-user-profile"); // Navbar link for the user profile
const $navLogOut = $("#nav-logout"); // Navbar "logout" link

const $newStoryForm = $("#new-story-form"); // Form element for submitting new stories

/**
 * Hide all page components, making it easier to selectively show specific ones.
 * This function is useful for resetting the page view before displaying
 * specific content (e.g., showing the login form or story list).
 */
function hidePageComponents() {
  const components = [
    $allStoriesList, // List of all stories
    $loginForm, // Login form
    $signupForm, // Signup form
    $newStoryForm, // Story submission form
  ];
  // Hide each component in the list
  components.forEach(c => c.hide());
}

/**
 * Overall function to start the app.
 * This function is called when the DOM is fully loaded.
 */
async function start() {
  console.debug("start");

  // Check if there is a remembered user in localStorage and log them in
  await checkForRememberedUser();
  // Fetch and display stories on the homepage
  await getAndShowStoriesOnStart();

  // If there is a logged-in user, update the UI accordingly
  if (currentUser) updateUIOnUserLogin();
}

/**
 * Event handler for clicking the "submit" link in the navbar.
 * When the "submit" link is clicked, this function hides other components
 * and shows the story submission form.
 */
$navSubmit.on("click", function () {
  console.debug("navSubmit clicked");
  hidePageComponents(); // Hide all other components
  $newStoryForm.show(); // Show the story submission form
});

/**
 * Once the DOM is fully loaded, begin the app.
 * This initializes the app by calling the `start` function.
 * 
 * NOTE: The console warning message instructs the student to enable
 * "Verbose" logging in the browser console to see debug messages.
 */
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start); // Start the app when the DOM is ready