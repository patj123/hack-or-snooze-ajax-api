"use strict";

// Cache commonly used DOM elements to avoid repeatedly finding them
const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");

const $navLogin = $("#nav-login");
const $navSubmit = $("#nav-submit"); // New: Reference to the "submit" link in the navbar
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");

const $newStoryForm = $("#new-story-form"); // New: Reference to the new story form

/** Hide all page components, making it easier to selectively show specific ones. */
function hidePageComponents() {
  const components = [
    $allStoriesList,
    $loginForm,
    $signupForm,
    $newStoryForm, // New: Hide the new story form by default
  ];
  components.forEach(c => c.hide());
}

/** Overall function to start the app. */
async function start() {
  console.debug("start");

  // Check if there is a remembered user and log them in
  await checkForRememberedUser();
  // Fetch and display stories on the homepage
  await getAndShowStoriesOnStart();

  // If there is a logged-in user, update the UI accordingly
  if (currentUser) updateUIOnUserLogin();
}

// Event handler for clicking the "submit" link in the navbar
$navSubmit.on("click", function () {
  console.debug("navSubmit clicked");
  hidePageComponents();
  $newStoryForm.show(); // Show the story submission form
});

// Once the DOM is fully loaded, start the app
console.warn("HEY STUDENT: This program sends many debug messages to" +
  " the console. If you don't see the message 'start' below this, you're not" +
  " seeing those helpful debug messages. In your browser console, click on" +
  " menu 'Default Levels' and add Verbose");
$(start);